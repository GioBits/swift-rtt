# Build stage
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files (package.json and package-lock.json)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Define a build argument for the API URL
ARG VITE_APP_API_URL

# Set the environment variable using the build argument
ENV VITE_APP_API_URL=${VITE_APP_API_URL}

# Build the application for production
RUN npm run build

# List the generated files (optional, for debugging)
RUN ls -la /app/dist

# Production stage
FROM nginx:stable-alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]