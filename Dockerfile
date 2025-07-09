# Stage 1: Build React App
FROM node:18-alpine AS client-build

WORKDIR /app

# Copy package files first for better caching
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci --only=production

# Copy client source and build
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm run build

# Stage 2: Setup Express Server
FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server source
WORKDIR /app
COPY server ./server

# Copy frontend build to server
COPY --from=client-build /app/client/build ./server/build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Set working directory
WORKDIR /app/server

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
