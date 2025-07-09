# Multi-stage build for production deployment
FROM node:18-alpine AS client-build

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/src ./src
COPY client/public ./public
RUN npm run build

# Production server
FROM node:18-alpine AS production

WORKDIR /app

# Copy server package files first for better caching
COPY server/package*.json ./
RUN npm ci --only=production

# Copy only necessary server files
COPY server/src ./src

# Copy built client assets
COPY --from=client-build /app/client/build ./public

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "src/server.js"]
