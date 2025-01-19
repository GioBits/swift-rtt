FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

RUN npm run build

RUN ls -la /app/dist

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
