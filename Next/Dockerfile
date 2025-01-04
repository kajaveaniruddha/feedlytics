# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the Next.js default port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
