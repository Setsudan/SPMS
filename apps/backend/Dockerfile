# Use Node.js 20 as base image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the backend code
COPY . .

# Generate Prisma client
RUN yarn prisma generate

# Build the backend
RUN yarn build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Expose the backend port
EXPOSE 5000

ENV NODE_ENV=production

# 🔥 Set the working directory before running Prisma
WORKDIR /app

# ✅ Ensure environment variables are loaded before running migrations
CMD ["sh", "-c", "yarn prisma migrate deploy && node dist/main"]
