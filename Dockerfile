# Stage 1: Build React App
FROM node:18 AS client-build

WORKDIR /app

COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install

COPY client ./client
RUN cd client && npm run build

# Stage 2: Setup Express Server
FROM node:18

WORKDIR /app

# Copy backend dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install

# Copy backend source
COPY server ./server

# Copy frontend build result ke backend (untuk di-serve static)
COPY --from=client-build /app/client/build ./server/build

# Set working directory ke server
WORKDIR /app/server

# Expose port (ganti ke 5000 kalau Express pakai itu)
EXPOSE 5000

# Jalankan server
CMD ["node", "server.js"]
