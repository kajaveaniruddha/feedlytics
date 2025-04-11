#!/bin/bash

set -e

# Set Docker Hub username
USERNAME=aniii1802

# Build Next.js
echo "🚀 Building Next.js..."
docker build -t $USERNAME/feedlytics-nextjs:latest ../Next
echo "📤 Pushing Next.js..."
docker push $USERNAME/feedlytics-nextjs:latest

# Build Services
echo "🚀 Building Services..."
docker build -t $USERNAME/feedlytics-services:latest ../Services
echo "📤 Pushing Services..."
docker push $USERNAME/feedlytics-services:latest

# Build Widget
echo "🚀 Building Widget..."
docker build -t $USERNAME/feedlytics-widget:latest ../Widget
echo "📤 Pushing Widget..."
docker push $USERNAME/feedlytics-widget:latest

echo "✅ All images built and pushed successfully!"


# docker rmi -f $(docker images -q)
