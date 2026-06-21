# --- Build stage -----------------------------------------------------------
# Build context is the ./web directory.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
# Same-origin in the compose/nginx setup: the browser calls "/api" and nginx
# proxies it to the API service.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Runtime stage (static files via nginx) --------------------------------
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
