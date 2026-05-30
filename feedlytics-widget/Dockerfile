# Base image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy dependencies manifest and .npmrc
COPY package.json pnpm-lock.yaml* .npmrc ./

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

ARG VITE_FEEDLYTICS_API_BASE_URL=https://api.feedlytics.in
ENV VITE_FEEDLYTICS_API_BASE_URL=$VITE_FEEDLYTICS_API_BASE_URL

# Build Vite app
RUN pnpm run build

# Install a lightweight HTTP server
RUN pnpm add serve

# Expose the Vite preview port
EXPOSE 4173

# Start the production server
CMD ["pnpm", "serve", "dist", "--single", "--listen", "4173"]
