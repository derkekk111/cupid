from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")

sentences = [
    "If your left shoe suddenly gained consciousness, what would it say about your life choices? Your foot is smelly.",
    "What’s the strangest object you could confidently beat someone with in a duel? Spatula",
]
emb = model.encode(sentences)
print(emb.shape)

similarities = model.similarity(emb, emb)
print(similarities)