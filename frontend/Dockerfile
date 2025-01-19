FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Define un argumento de construcción
ARG VITE_APP_API_URL

# Establece la variable de entorno usando el argumento de construcción
ENV VITE_APP_API_URL=${VITE_APP_API_URL}

RUN npm run build

RUN ls -la /app/dist

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
