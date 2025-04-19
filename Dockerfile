# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app
# Copy package.json and lock file
COPY vibequant/package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY vibequant/ .
# Build the application
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine

# Copy built assets from the build stage to Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration
# Assuming nginx.conf remains in the vibequant directory
COPY vibequant/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
