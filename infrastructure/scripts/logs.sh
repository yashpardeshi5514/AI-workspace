#!/bin/bash

# View logs for all services
echo "Backend logs:"
docker logs ai-workspace-backend --tail=50

echo -e "\nFrontend logs:"
docker logs ai-workspace-frontend --tail=50

echo -e "\nDatabase logs:"
docker logs ai-workspace-mongo --tail=20
