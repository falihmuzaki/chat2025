# Dockerfile
FROM node:18

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Start with development server (hot reload)
CMD ["npm", "run", "start:poll"]
