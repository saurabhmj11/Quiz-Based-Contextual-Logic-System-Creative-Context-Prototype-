import faiss
import numpy as np
import json
import os
from sentence_transformers import SentenceTransformer

class FaissVectorStore:
    def __init__(self, dataset_path=None):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = 384
        self.index = faiss.IndexFlatL2(self.dimension)
        self.documents = []
        
        if dataset_path:
            self.load_and_index(dataset_path)

    def load_and_index(self, dataset_path):
        print(f"Loading knowledge base from {dataset_path}...")
        try:
            with open(dataset_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Prepare documents
            texts = []
            for item in data:
                # Create a rich representation of the concept
                content = f"Question: {item['question']} Answer: {item['correct']} Topic: {item['topic']} Misconception: {item.get('misconception', '')}"
                texts.append(content)
                self.documents.append(item) # Store full metadata
            
            # Embed
            print("Embedding documents (this may take a moment)...")
            embeddings = self.model.encode(texts)
            
            # Index
            self.index.add(np.array(embeddings, dtype='float32'))
            print(f"Indexed {self.index.ntotal} documents.")
            
        except Exception as e:
            print(f"Failed to load vector store: {e}")

    def search(self, query, k=3):
        query_vector = self.model.encode([query])
        distances, indices = self.index.search(np.array(query_vector, dtype='float32'), k)
        
        results = []
        for idx in indices[0]:
            if idx < len(self.documents):
                results.append(self.documents[idx])
        return results

# Singleton instance
current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, "..", "datasets", "questions.json")

# Initialize immediately for prototype simplicity (migth block startup for a few secs)
vector_store = FaissVectorStore(dataset_path)
