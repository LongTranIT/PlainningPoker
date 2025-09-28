# -------- Stage 1: Build --------
# Use Node.js 23.5.0 as the build environment
FROM node:23.5.0 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the Next.js application
RUN npm run build


# -------- Stage 2: Run --------
# Use Node.js 23.5.0 as the runtime environment
FROM node:23.5.0 AS runner
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose port 8888 inside the container
EXPOSE 8888

# Start the Next.js server on port 8888
CMD ["npm", "run", "start", "--", "-p", "8888"]
