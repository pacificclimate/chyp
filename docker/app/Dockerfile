# Stage 1: Build the Vite app
FROM node:22-alpine AS builder

WORKDIR /app

COPY ./app/package.json ./app/package-lock.json ./
RUN npm install

COPY ./app /app
RUN npm run build

# Stage 2: Serve
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY ./docker/app/server.js /app/server.js

EXPOSE 8080

CMD ["node", "server.js"]
