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

# Expose the service port (e.g., 3001)
EXPOSE 3001

# Start the service
CMD ["pnpm", "run", "start"]
