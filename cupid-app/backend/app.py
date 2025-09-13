import numpy as np
from sentence_transformers import SentenceTransformer, util
from supabase import create_client
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import uvicorn
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -----------------------------
# Environment Configuration
# -----------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -----------------------------
# AI Model Setup
# -----------------------------
logger.info("Loading sentence transformer model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
logger.info("Model loaded successfully!")

# -----------------------------
# Pydantic Models
# -----------------------------
class UserAnswer(BaseModel):
    user_id: str
    question_id: str
    question_text: str
    answer_text: str

class MatchRequest(BaseModel):
    user1_id: str
    user2_id: str

class CompatibilityResponse(BaseModel):
    compatibility_score: float
    shared_interests: List[str]
    personality_match: float
    recommendation: str
    detailed_analysis: Dict[str, any]

# -----------------------------
# Core AI Functions
# -----------------------------
def embed_text(text: str) -> np.ndarray:
    """Generate embedding for text"""
    try:
        return model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise

def residualize_answer(answer: str, question: str) -> np.ndarray:
    """Remove question influence from answer embedding"""
    try:
        a_vec = embed_text(answer)
        q_vec = embed_text(question)
        
        # Project answer onto question and subtract
        dot_product = np.dot(a_vec, q_vec)
        q_norm_squared = np.dot(q_vec, q_vec)
        
        if q_norm_squared == 0:
            return a_vec / np.linalg.norm(a_vec)
            
        proj = (dot_product / q_norm_squared) * q_vec
        residual = a_vec - proj
        
        # Normalize the residual
        norm = np.linalg.norm(residual)
        return residual / norm if norm > 0 else residual
        
    except Exception as e:
        logger.error(f"Error in residualization: {e}")
        raise

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculate cosine similarity between vectors"""
    try:
        return float(util.cos_sim(vec1, vec2)[0][0])
    except Exception as e:
        logger.error(f"Error calculating cosine similarity: {e}")
        return 0.0

def calculate_personality_compatibility(user1_answers: List[Dict], user2_answers: List[Dict]) -> Dict:
    """Calculate personality compatibility based on question answers"""
    try:
        if not user1_answers or not user2_answers:
            return {
                "score": 0.5,
                "details": "Insufficient data for personality analysis"
            }
        
        similarities = []
        comparisons = []
        
        for ans1 in user1_answers:
            for ans2 in user2_answers:
                if ans1['question_id'] == ans2['question_id']:
                    # Same question - compare answers
                    if ans1.get('embedding') and ans2.get('embedding'):
                        vec1 = np.array(ans1['embedding'])
                        vec2 = np.array(ans2['embedding'])
                        sim = cosine_similarity(vec1, vec2)
                        similarities.append(sim)
                        comparisons.append({
                            'question': ans1.get('question_text', 'Unknown'),
                            'user1_answer': ans1.get('free_text', ''),
                            'user2_answer': ans2.get('free_text', ''),
                            'similarity': sim
                        })
        
        if similarities:
            avg_similarity = np.mean(similarities)
            # Convert to 0-1 scale where 0.5 is neutral
            personality_score = (avg_similarity + 1) / 2
        else:
            personality_score = 0.5
            
        return {
            "score": personality_score,
            "comparisons": comparisons,
            "details": f"Analyzed {len(similarities)} question pairs"
        }
        
    except Exception as e:
        logger.error(f"Error calculating personality compatibility: {e}")
        return {
            "score": 0.5,
            "details": f"Error in analysis: {str(e)}"
        }

def calculate_interest_compatibility(user1_interests: List[str], user2_interests: List[str]) -> Dict:
    """Calculate compatibility based on shared interests"""
    try:
        if not user1_interests or not user2_interests:
            return {
                "score": 0.0,
                "shared_interests": [],
                "total_interests": len(user1_interests) + len(user2_interests)
            }
        
        shared = list(set(user1_interests) & set(user2_interests))
        total_unique = len(set(user1_interests) | set(user2_interests))
        
        if total_unique == 0:
            score = 0.0
        else:
            # Jaccard similarity
            score = len(shared) / total_unique
        
        return {
            "score": score,
            "shared_interests": shared,
            "total_interests": total_unique,
            "user1_unique": list(set(user1_interests) - set(user2_interests)),
            "user2_unique": list(set(user2_interests) - set(user1_interests))
        }
        
    except Exception as e:
        logger.error(f"Error calculating interest compatibility: {e}")
        return {
            "score": 0.0,
            "shared_interests": [],
            "total_interests": 0
        }

# -----------------------------
# Database Functions
# -----------------------------
async def process_user_answer(user_answer: UserAnswer) -> bool:
    """Process a new user answer and store embeddings"""
    try:
        # Generate residual embedding
        embedding = residualize_answer(user_answer.answer_text, user_answer.question_text)
        
        # Store the answer
        answer_data = {
            "user_id": user_answer.user_id,
            "question_id": user_answer.question_id,
            "free_text": user_answer.answer_text,
            "created_at": datetime.now().isoformat()
        }
        
        result = supabase.table("survey_answers").insert(answer_data).execute()
        answer_id = result.data[0]["id"]
        
        # Store embedding
        embedding_data = {
            "answer_id": answer_id,
            "embedding": embedding.tolist()
        }
        
        supabase.table("answer_embeddings").insert(embedding_data).execute()
        
        # Calculate similarities with existing answers
        await calculate_answer_similarities(answer_id, embedding)
        
        logger.info(f"Processed answer for user {user_answer.user_id}")
        return True
        
    except Exception as e:
        logger.error(f"Error processing user answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def calculate_answer_similarities(new_answer_id: int, new_embedding: np.ndarray):
    """Calculate similarities between new answer and all existing answers"""
    try:
        # Get all existing embeddings except the new one
        existing = supabase.table("answer_embeddings").select("*").neq("answer_id", new_answer_id).execute()