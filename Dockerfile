FROM node:16.10.0-slim
EXPOSE 3000

RUN mkdir -p /app
RUN node -v
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npx tsc
CMD node dist/app.js