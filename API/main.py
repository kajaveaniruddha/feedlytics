from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from transformers import pipeline
import logging
import time

app = FastAPI()

# Initialize pipelines
sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
feedback_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

class ReviewRequest(BaseModel):
    review: str

class SentimentResult(BaseModel):
    label: str
    score: float

class ResponseItem(BaseModel):
    review: str
    overall_sentiment: SentimentResult
    feedback_classification: List[str]

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(threadName)s: %(message)s')

@app.post("/analyze", response_model=ResponseItem)
def analyze_review(request: ReviewRequest):
    start_time = time.time()  # Record start time

    label_mapping = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive"}

    review = request.review

    # Perform sentiment analysis
    sentiment_result = sentiment_pipeline(review)[0]
    label = label_mapping.get(sentiment_result['label'], sentiment_result['label']).lower()
    score = sentiment_result['score']

    # Perform feedback classification
    candidate_labels = ['bug', 'request', 'praise', 'complaint', 'suggestion', 'question']

    feedback_result = feedback_classifier(review, candidate_labels=candidate_labels, multi_label=True)
    classification_scores = dict(zip(feedback_result['labels'], feedback_result['scores']))

    # Get labels where the score is above a threshold
    CONFIDENCE_THRESHOLD = 0.9
    top_labels = [label for label, score in classification_scores.items() if score >= CONFIDENCE_THRESHOLD]

    if not top_labels:
        top_labels = ['other']

    logging.info(f"Processed review: {review} -> Sentiment: {label}, Score: {score}, Feedback Classification: {', '.join(top_labels)}")

    response_item = ResponseItem(
        review=review,
        overall_sentiment=SentimentResult(label=label, score=score),
        feedback_classification=top_labels
    )

    end_time = time.time()  # Record end time
    duration = end_time - start_time  # Calculate duration
    logging.info(f"API execution time: {duration:.4f} seconds")  # Log execution time

    return response_item
