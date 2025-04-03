# Use the official Node.js image
FROM node:18-alpine
RUN npm install -g pnpm

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN pnpm run build

# Expose the Next.js default port
EXPOSE 5173

# Start the app
CMD ["pnpm", "run", "start"]
