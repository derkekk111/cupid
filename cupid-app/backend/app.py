import numpy as np
from sentence_transformers import SentenceTransformer, util

# Load a lightweight sentence transformer
model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_text(text: str) -> np.ndarray:
    """Create an embedding for any text input"""
    return model.encode(text, convert_to_numpy=True, normalize_embeddings=True)


def residualize_answer(answer: str, question: str) -> np.ndarray:
    """
    Remove the influence of the question from the answer embedding.
    Answer_residual = Answer - proj(Answer onto Question)
    """
    a_vec = embed_text(answer)
    q_vec = embed_text(question)

    # Projection of a onto q
    proj = (np.dot(a_vec, q_vec) / np.dot(q_vec, q_vec)) * q_vec
    residual = a_vec - proj
    return residual / np.linalg.norm(residual)


def embed_pair(question: str, answer: str) -> np.ndarray:
    """
    Alternative approach: combine question + answer into one representation.
    """
    text = f"Q: {question}\nA: {answer}"
    return embed_text(text)


def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Compute cosine similarity between two embeddings"""
    return float(util.cos_sim(vec1, vec2)[0][0])


# --- Example usage ---
if __name__ == "__main__":
    # User A
    qA = "If you were a kitchen appliance, which one would you be and why?"
    aA = "Spatula for sure, no contest."

    # User B
    qB = "What animal do you think is secretly plotting against humanity?"
    aB = "Definitely ducks are evil masterminds."

    # Option 1: residual method
    resA = residualize_answer(aA, qA)
    resB = residualize_answer(aB, qB)

    print("Residual cosine similarity:", cosine_similarity(resA, resB))

    # Option 2: combined Q+A method
    embA = embed_pair(qA, aA)
    embB = embed_pair(qB, aB)

    print("Combined Q+A cosine similarity:", cosine_similarity(embA, embB))
