import numpy as np
from sentence_transformers import SentenceTransformer, util
from supabase import create_client
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# -----------------------------
# Supabase setup
# -----------------------------
SUPABASE_URL = "https://YOUR-PROJECT.supabase.co"
SUPABASE_KEY = "YOUR-SERVICE-ROLE-KEY"  # ⚠️ keep safe, server-side only
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -----------------------------
# ML model setup
# -----------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text: str) -> np.ndarray:
    """Generate embedding"""
    return model.encode(text, convert_to_numpy=True, normalize_embeddings=True)

def residualize_answer(answer: str, question: str) -> np.ndarray:
    """Subtract influence of question from answer embedding"""
    a_vec = embed_text(answer)
    q_vec = embed_text(question)
    proj = (np.dot(a_vec, q_vec) / np.dot(q_vec, q_vec)) * q_vec
    residual = a_vec - proj
    return residual / np.linalg.norm(residual)

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Cosine similarity"""
    return float(util.cos_sim(vec1, vec2)[0][0])

# -----------------------------
# Business logic
# -----------------------------
def process_new_answer(answer_id: int):
    # 1. Fetch answer and its question
    ans = supabase.table("survey_answers").select("id, question_id, free_text").eq("id", answer_id).single().execute().data
    q = supabase.table("survey_questions").select("prompt").eq("id", ans["question_id"]).single().execute().data

    # 2. Compute residual embedding
    vec = residualize_answer(ans["free_text"], q["prompt"])

    # 3. Insert into answer_embeddings
    supabase.table("answer_embeddings").insert({
        "answer_id": ans["id"],
        "embedding": vec.tolist()
    }).execute()

    # 4. Compare against all previous embeddings
    others = supabase.table("answer_embeddings").select("answer_id, embedding").neq("answer_id", ans["id"]).execute().data
    for other in others:
        other_vec = np.array(other["embedding"], dtype=np.float32)
        sim = cosine_similarity(vec, other_vec)

        supabase.table("answer_similarities").insert({
            "answer1_id": ans["id"],
            "answer2_id": other["answer_id"],
            "similarity": sim
        }).execute()

    print(f"✅ Processed answer {ans['id']} and computed {len(others)} similarities.")

# -----------------------------
# FastAPI server
# -----------------------------
class Payload(BaseModel):
    answer_id: int

app = FastAPI()

@app.post("/process")
def process(payload: Payload):
    process_new_answer(payload.answer_id)
    return {"status": "done", "answer_id": payload.answer_id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
