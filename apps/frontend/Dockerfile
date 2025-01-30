# Use Node.js 18 as base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Angular application
RUN yarn build --configuration=production

# ---- Production Stage ----
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy built Angular files from the builder stage
COPY --from=builder /app/dist/frontend ./

# Expose the port used by Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
