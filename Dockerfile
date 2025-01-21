# Stage 1: Build the app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the built output and dependencies
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/build ./build

# Expose the app port
EXPOSE 3000

# Set default command
CMD ["node", "build"]
