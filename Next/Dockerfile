FROM node:18-alpine as builder
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:18-alpine as runner
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "run", "start"]
