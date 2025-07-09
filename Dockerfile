# Multi-stage production Dockerfile

# Stage 1: Build client
FROM node:18 as client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Build server
FROM node:18 as server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Stage 3: Production
FROM node:18-alpine
RUN apk add --no-cache nginx supervisor

# Setup nginx
COPY --from=client-build /app/client/build /usr/share/nginx/html
RUN mkdir -p /run/nginx

# Setup server
WORKDIR /app
COPY --from=server-build /app/server ./

# Create nginx config
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://localhost:5000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/http.d/default.conf

# Create supervisor config
RUN echo '[supervisord] \
nodaemon=true \
\
[program:nginx] \
command=nginx -g "daemon off;" \
autostart=true \
autorestart=true \
\
[program:server] \
command=node src/server.js \
directory=/app \
autostart=true \
autorestart=true' > /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
