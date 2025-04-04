# Base image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy dependencies manifest
COPY package.json pnpm-lock.yaml* ./

# Install deps
RUN pnpm install

# Copy source
COPY . .

# Build Vite app
RUN pnpm run build

# Install a lightweight HTTP server
RUN pnpm add serve

# Expose the Vite preview port (or use 4173 if using `vite preview`)
EXPOSE 4173

# Start the production server
CMD ["pnpm", "serve", "dist", "--single", "--listen", "4173"]
