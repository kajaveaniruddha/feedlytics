from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from transformers import pipeline

app = FastAPI()

# Initialize the sentiment pipeline outside of the function to avoid reloading the model on every request
sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")

class ReviewRequest(BaseModel):
    reviews: List[str]

class SentimentResult(BaseModel):
    label: str
    score: float

class ResponseItem(BaseModel):
    review: str
    overall_sentiment: SentimentResult

@app.post("/analyze", response_model=List[ResponseItem])
def analyze_reviews(request: ReviewRequest):
    label_mapping = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive"}
    results = [
        ResponseItem(
            review=review, 
            overall_sentiment=SentimentResult(
                label=label_mapping.get(sentiment_pipeline(review)[0]['label'], sentiment_pipeline(review)[0]['label']).lower(), 
                score=sentiment_pipeline(review)[0]['score']
            )
        )
        for review in request.reviews
    ]
    return results
