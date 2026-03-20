# client/Dockerfile
#  Stage 1 Build the React application --
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
#  Stage 2 Serve the React application with Nginx --
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
# Optional: Copy a custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]