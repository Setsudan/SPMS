# ---- Stage 1: Build Angular App ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build --configuration=production

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# 🛑 Remove all default Nginx content
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

# ✅ Copy built Angular files
COPY --from=builder /app/dist/frontend/browser/ ./

# ✅ Copy the correct Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

