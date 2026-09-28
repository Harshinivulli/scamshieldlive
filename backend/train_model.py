#!/usr/bin/env python3
"""
ScamShield Live - Machine Learning Training Pipeline
Trains a Logistic Regression classifier on TF-IDF n-grams to detect scams.
"""

import os
import re
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

def clean_text(text: str) -> str:
    """Preprocess text by lowercasing, removing special symbols, and standardizing whitespace."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', ' urltoken ', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_scam_model(data_path: str, model_output_path: str):
    print("=" * 60)
    print("ScamShield Live ML Training Pipeline")
    print("=" * 60)

    # 1. Load dataset
    print(f"[1/8] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"      Total records loaded: {len(df)}")

    # 2. Clean text
    print("[2/8] Preprocessing and cleaning text...")
    df['cleaned_text'] = df['message_text'].apply(clean_text)

    # 3. Remove duplicates
    print("[3/8] Removing duplicate samples...")
    initial_len = len(df)
    df = df.drop_duplicates(subset=['cleaned_text']).reset_index(drop=True)
    print(f"      Dropped {initial_len - len(df)} duplicates. Remaining: {len(df)}")

    X = df['cleaned_text']
    y = df['label']

    # 4. Split into train / test
    print("[4/8] Splitting dataset into train and test sets (80/20 split)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # 5 & 6. Apply TF-IDF and Train Logistic Regression
    print("[5/8] Constructing TF-IDF Vectorizer (ngram_range=(1, 2))...")
    print("[6/8] Training Logistic Regression model with L2 regularization...")
    
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
        ('clf', LogisticRegression(class_weight='balanced', max_iter=1000, C=1.0))
    ])

    pipeline.fit(X_train, y_train)

    # 7. Evaluate metrics
    print("[7/8] Evaluating model performance on test set...")
    y_pred = pipeline.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)

    print("\n" + "-" * 40)
    print("MODEL EVALUATION METRICS:")
    print(f"Accuracy  : {acc * 100:.2f}%")
    print(f"Precision : {prec * 100:.2f}%")
    print(f"Recall    : {rec * 100:.2f}%")
    print(f"F1-Score  : {f1 * 100:.2f}%")
    print("-" * 40 + "\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Legitimate', 'Scam'], zero_division=0))

    # 8. Save trained model
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    print(f"[8/8] Saving trained pipeline to {model_output_path}...")
    with open(model_output_path, 'wb') as f:
        pickle.dump(pipeline, f)

    print("\n[SUCCESS] Model training complete. Ready for Flask deployment.")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_file = os.path.join(base_dir, 'dataset', 'dataset.csv')
    output_model = os.path.join(base_dir, 'models', 'scam_model.pkl')
    train_scam_model(dataset_file, output_model)
