# --- STAGE 1: BUILD ---
FROM node:18-alpine as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

# ✅ FIX: Correct QA ALB endpoint
# The QA ALB from your error: uce-trade-qa-alb-1533665450.us-east-1.elb.amazonaws.com
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://uce-trade-qa-alb-1533665450.us-east-1.elb.amazonaws.com/api}

RUN VITE_API_URL=${VITE_API_URL} npm run build

# --- STAGE 2: RUN (Nginx) ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]