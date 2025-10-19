# Multi-stage Dockerfile for Next.js (dev + prod)
# syntax=docker/dockerfile:1.6

# --- Base deps stage ---
FROM node:20-alpine AS deps
WORKDIR /app
# Enable libc compatibility for some native deps
RUN apk add --no-cache libc6-compat
COPY package.json .
# no lock file present -> use npm ci fallback to npm install
RUN npm install --no-audit --no-fund

# --- Builder (prod build) ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production runtime ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./next.config.js 2>/dev/null || true
COPY --from=builder /app/next.config.mjs ./next.config.mjs 2>/dev/null || true
COPY --from=builder /app/next.config.ts ./next.config.ts 2>/dev/null || true
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]

# --- Dev target ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true
COPY . .
RUN npm install --no-audit --no-fund
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["npm", "run", "dev"]
