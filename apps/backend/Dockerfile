FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn global add typescript && yarn install --check-files

COPY . .

RUN yarn build

CMD ["node", "dist/server.js"]

EXPOSE 3000