#!/bin/bash

# Stop all services
echo "Stopping services..."
docker-compose -f docker-compose.prod.yml down

# Remove volumes (optional)
# docker-compose -f docker-compose.prod.yml down -v

echo "Services stopped"
