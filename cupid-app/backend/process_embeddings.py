import os
import numpy as np
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer, util
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

# --- Supabase connection ---
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]  # backend only
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Load sentence transformer ---
model = SentenceTransformer("all-MiniLM-L6-v2")


# --- Helper functions ---
def embed_text(text: str) -> np.ndarray:
    return model.encode(text, convert_to_numpy=True, normalize_embeddings=True)


def residualize_answer(answer: str, question: str) -> np.ndarray:
    """Remove question influence from answer embedding"""
    a_vec = embed_text(answer)
    q_vec = embed_text(question)
    proj = (np.dot(a_vec, q_vec) / np.dot(q_vec, q_vec)) * q_vec
    residual = a_vec - proj
    return residual / np.linalg.norm(residual)


def process_new_answers():
    # 1. Fetch answers that are NOT yet embedded
    answers = (
        supabase.table("survey_answers")
        .select("id, free_text, question_id")
        .not_("id", "in", supabase.table("answer_embeddings").select("answer_id").execute().data)
        .execute()
    ).data

    if not answers:
        print("No new answers to process.")
        return

    for ans in answers:
        # Fetch the question text
        question_data = (
            supabase.table("survey_questions")
            .select("prompt")
            .eq("id", ans["question_id"])
            .single()
            .execute()
        ).data

        question_text = question_data["prompt"]
        answer_text = ans["free_text"]

        # Compute embedding (residual method)
        emb = residualize_answer(answer_text, question_text)

        # Store embedding in answer_embeddings table
        supabase.table("answer_embeddings").insert(
            {
                "answer_id": ans["id"],
                "embedding": emb.tolist(),  # Supabase vector column expects a list
            }
        ).execute()
        print(f"Processed embedding for answer {ans['id']}")


if __name__ == "__main__":
    process_new_answers()
