FROM node:18-alpine as builder

# Install pnpm
RUN npm install -g pnpm
ARG DATABASE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG STRIPE_PRICE_ID
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET

ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    STRIPE_PRICE_ID=$STRIPE_PRICE_ID \
    STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY \
    STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET 
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
