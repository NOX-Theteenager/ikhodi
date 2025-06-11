# 1. Base image
FROM node:20-alpine AS base

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json (or yarn.lock if used)
COPY package.json package-lock.json ./

# 4. Install dependencies for production
FROM base AS deps
RUN npm install --production

# 5. Copy application code
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 6. Build the Next.js application
RUN npm run build

# 7. Production image: copy only necessary files
FROM base AS runner
ENV NODE_ENV production
# Next.js listens on port 3000 by default, and Render will use the PORT env var.
# EXPOSE 3000 (Exposing is good practice but not strictly necessary for Render as it uses the PORT env var)

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set the correct user for running the application (optional but good practice)
# USER nextjs (Next.js creates a 'nextjs' user in its official Docker image, but we are using a generic node image)
# If you don't have a specific user, you can run as node or create one.
# For now, we'll run as the default user (root, then node if specified by the base image)

# 8. Command to start the application
CMD ["node", "server.js"]
