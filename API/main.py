from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from transformers import pipeline

app = FastAPI()

class ReviewRequest(BaseModel):
    reviews: List[str]

class SentimentResult(BaseModel):
    label: str
    score: float

class ResponseItem(BaseModel):
    review:str
    overall_sentiment: SentimentResult
    aspects: List[str]

@app.post("/analyze", response_model=List[ResponseItem])
def analyze_reviews(request: ReviewRequest):
    sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    candidate_labels = ["bug", "praise", "quality", "suggestion"]
    label_mapping = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive"}
    results = []
    for review in request.reviews:
        sentiment = sentiment_pipeline(review)[0]
        sentiment_label = label_mapping.get(sentiment['label'], sentiment['label'])
        classification = classifier(review, candidate_labels)
        aspects = [label for label, score in zip(classification['labels'], classification['scores']) if score > 0.5]
        # print(classification['scores'])
        results.append(ResponseItem(review=review,overall_sentiment=SentimentResult(label=sentiment_label, score=sentiment['score']), aspects=aspects))
    return results
