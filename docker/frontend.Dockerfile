FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/reflections-app/package*.json ./frontend/reflections-app/

# Install dependencies
RUN cd frontend/reflections-app && npm ci

# Copy source code
COPY frontend/reflections-app/ ./frontend/reflections-app/

# Build the application
WORKDIR /app/frontend/reflections-app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/frontend/reflections-app/out /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]