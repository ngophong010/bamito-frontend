# ====================================================================================
# STAGE 1: The Builder Stage - Creates the optimized production build
# ====================================================================================
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install ALL dependencies (including dev) for building
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Set environment variables for the build process if needed
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Run the production build
RUN npm run build

# ====================================================================================
# STAGE 2: The Runner Stage - Creates the final, slim production image
# ====================================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# --- The Magic: Copy ONLY the necessary artifacts from the 'builder' stage ---

# 1. Copy the standalone Next.js server output
COPY --from=builder /app/.next/standalone ./

# 2. Copy the public assets (images, fonts, etc.)
COPY --from=builder /app/public ./public

# 3. Copy the static build assets (compiled JS, CSS)
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app will run on
EXPOSE 3000

# The command to start the optimized Next.js server
CMD ["node", "server.js"]