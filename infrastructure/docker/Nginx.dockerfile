# Nginx reverse proxy for production
FROM nginx:alpine

# Copy nginx config
COPY infrastructure/nginx.conf /etc/nginx/nginx.conf
COPY infrastructure/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
