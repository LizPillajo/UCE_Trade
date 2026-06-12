# --- STAGE 1: BUILD ---
FROM node:18-alpine as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN VITE_API_URL=http://uce-trade-ms1-alb-1397163559.us-east-1.elb.amazonaws.com/api npm run build

# --- STAGE 2: RUN (Nginx) ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]