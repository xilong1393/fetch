FROM node:16
EXPOSE 3001

RUN mkdir -p /app
WORKDIR /app
COPY . /app
LABEL "com.datadoghq.ad.logs"='[{"source": "nodejs", "service": "fetch"}]'
RUN npm ci
RUN npx tsc
CMD node dist/app.js