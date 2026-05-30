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

# Compile TypeScript so build failures fail the image build
RUN pnpm run build

# Expose HTTP + gRPC (internal Docker network only in production)
EXPOSE 3001 9090

# Start the compiled service
CMD ["node", "dist/index.js"]
