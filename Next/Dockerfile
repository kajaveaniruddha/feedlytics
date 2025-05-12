FROM node:18-alpine as builder

# Install pnpm
RUN npm install -g pnpm
ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL
# Set working dir and copy files
WORKDIR /app
COPY . .

# Install deps
RUN pnpm install --frozen-lockfile

ENV $(cat .env | grep -v '^#' | xargs)
RUN pnpm build

# --------------------------------

FROM node:18-alpine as runner
RUN npm install -g pnpm
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "run", "start"]
