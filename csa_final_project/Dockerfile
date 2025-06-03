# Use an official Nginx image to serve static files
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your game files to nginx's web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
