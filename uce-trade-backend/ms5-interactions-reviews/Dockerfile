# uce-trade-backend/ms5-interactions-reviews/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 8084

CMD ["npm", "start"]