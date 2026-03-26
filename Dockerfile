# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /build

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (frozen/reproducible)
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Final stage
FROM node:22-alpine

# Create non-root user with UID 1000
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder --chown=appuser:appgroup /build/node_modules ./node_modules

# Copy application code from builder stage
COPY --from=builder --chown=appuser:appgroup /build/src ./src

# Copy package.json (needed for Node.js module resolution)
COPY --chown=appuser:appgroup package.json ./

# Switch to non-root user
USER 1000

# Run the application
CMD ["node", "src/index.js"]