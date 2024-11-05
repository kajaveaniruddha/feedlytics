from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from transformers import pipeline
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
import time

app = FastAPI()

sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")

class ReviewRequest(BaseModel):
    reviews: List[str]

class SentimentResult(BaseModel):
    label: str
    score: float

class ResponseItem(BaseModel):
    review: str
    overall_sentiment: SentimentResult

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(threadName)s: %(message)s')

# Initialize the thread pool with a desired number of workers
executor = ThreadPoolExecutor(max_workers=4)

@app.post("/analyze", response_model=List[ResponseItem])
def analyze_reviews(request: ReviewRequest):
    start_time = time.time()  # Record start time
    
    label_mapping = {"LABEL_0": "negative", "LABEL_1": "neutral", "LABEL_2": "positive"}
    
    # Function to process each review
    def process_review(review):
        result = sentiment_pipeline(review)[0]
        label = label_mapping.get(result['label'], result['label']).lower()
        score = result['score']
        logging.info(f"Processed review: {review} -> {label}, Score: {score}")
        return ResponseItem(review=review, overall_sentiment=SentimentResult(label=label, score=score))

    # Submit tasks to the thread pool
    futures = [executor.submit(process_review, review) for review in request.reviews]
    
    # Collect results as they complete
    results = [future.result() for future in as_completed(futures)]
    
    end_time = time.time()  # Record end time
    duration = end_time - start_time  # Calculate duration
    logging.info(f"API execution time: {duration:.4f} seconds")  # Log execution time
    
    return results
