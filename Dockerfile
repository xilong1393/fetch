FROM node:16.10.0-slim

ENV port=3000

EXPOSE $port

RUN mkdir -p /app
RUN node -v
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npx tsc
CMD node dist/app.js