# Use the official Node.js image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json, lockfile, and .npmrc
COPY package*.json ./
COPY pnpm-lock.yaml* ./
COPY .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose HTTP + gRPC (internal Docker network only in production)
EXPOSE 3001 9090

# Start the service
CMD ["pnpm", "run", "start"]
