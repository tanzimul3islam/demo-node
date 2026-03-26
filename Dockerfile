# Build stage
FROM node:22-alpine AS builder

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY src/ ./src/

# Final stage
FROM node:22-alpine

WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder --chown=node:node /build/node_modules ./node_modules

# Copy application code from builder stage
COPY --from=builder --chown=node:node /build/src ./src

# Copy package.json
COPY --chown=node:node package.json ./

# Switch to built-in non-root node user ✅
USER node

CMD ["node", "src/index.js"]