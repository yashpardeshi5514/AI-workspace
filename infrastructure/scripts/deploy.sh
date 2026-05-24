#!/bin/bash

# Build all images
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

# Start services
echo "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
echo "Waiting for services to start..."
sleep 10

# Check health
echo "Checking service health..."
docker-compose -f docker-compose.prod.yml ps

echo "Deployment complete!"
echo "Access the app at http://localhost"
