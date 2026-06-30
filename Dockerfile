# ============================================
# Stage 1: Build React client
# ============================================
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ .
RUN npm run build

# ============================================
# Stage 2: Server production deps
# ============================================
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --production --silent
COPY server/ .

# ============================================
# Stage 3: Minimal production image
# ============================================
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY --from=server-builder /app/server ./server
COPY --from=client-builder /app/client/dist ./server/public
RUN mkdir -p ./server/uploads
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 && chown -R nodejs:nodejs /app
USER nodejs
WORKDIR /app/server
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD node -e "require('http').get('http://localhost:5000/',(r)=>r.statusCode===200?process.exit(0):process.exit(1))"
ENTRYPOINT ["dumb-init","--"]
CMD ["node","server.js"]