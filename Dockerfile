# ---- Stage 1: Install Dependencies ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ---- Stage 2: Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (NEXT_PUBLIC_* must be available at build time)
ARG NEXT_PUBLIC_BACKEND_API_URL
ARG NEXT_PUBLIC_PAYMENT_WEBHOOK_URL
ARG NEXT_PUBLIC_WHATSAPP_BACKEND_URL
ARG NEXT_PUBLIC_MCP_SERVER_URL

ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL
ENV NEXT_PUBLIC_PAYMENT_WEBHOOK_URL=$NEXT_PUBLIC_PAYMENT_WEBHOOK_URL
ENV NEXT_PUBLIC_WHATSAPP_BACKEND_URL=$NEXT_PUBLIC_WHATSAPP_BACKEND_URL
ENV NEXT_PUBLIC_MCP_SERVER_URL=$NEXT_PUBLIC_MCP_SERVER_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Stage 3: Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
