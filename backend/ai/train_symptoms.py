import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

df = pd.read_csv("backend/ai/symptoms_small.csv")
X, y = df["text"], df["label"]

pipe = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
    ("clf", LogisticRegression(max_iter=1000))
])

pipe.fit(X, y)
print(classification_report(y, pipe.predict(X)))

joblib.dump(pipe, "backend/ai/symptom_model.joblib")
print("Saved -> backend/ai/symptom_model.joblib")
