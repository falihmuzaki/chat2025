# Multi-stage build for production deployment
FROM node:18-alpine AS client-build

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Production server
FROM node:18-alpine AS production

WORKDIR /app

# Copy server package files
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source
COPY server/ ./

# Copy built client to server's public directory
COPY --from=client-build /app/client/build ./public

# Expose port (Railway will override with PORT env var)
EXPOSE 5000

# Start server in production mode
CMD ["node", "src/server.js"]
