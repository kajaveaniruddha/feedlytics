FROM node:18-alpine as builder

# Install pnpm
RUN npm install -g pnpm

# Accept and set the build-time ARG
ARG DATABASE_URL
# Set default if not provided
ENV DATABASE_URL=${DATABASE_URL:-postgresql://feedlytics-db_owner:tDyRUmfc4l7N@ep-patient-boat-a13wvjzk-pooler.ap-southeast-1.aws.neon.tech/feedlytics-db?sslmode=require}

# Set working dir and copy files
WORKDIR /app
COPY . .

# Install deps
RUN pnpm install --frozen-lockfile

# Build with DATABASE_URL in env
RUN pnpm build

# --------------------------------

FROM node:18-alpine as runner
RUN npm install -g pnpm
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "run", "start"]
