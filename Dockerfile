# ─── Stage 1: Build Backend ───────────────────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /build/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

# ─── Stage 2: Build Frontend ──────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /build/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ─── Stage 3: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Install Nginx
RUN apk add --no-cache nginx

# ── Backend ──────────────────────────────────────────────────────────────────
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=backend-builder /build/backend/dist ./dist

# ── Frontend (served by Nginx) ────────────────────────────────────────────────
COPY --from=frontend-builder /build/frontend/dist /usr/share/nginx/html

# ── Nginx config ──────────────────────────────────────────────────────────────
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /var/log/nginx /var/lib/nginx/tmp

# ── Entrypoint ────────────────────────────────────────────────────────────────
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Data volume for SQLite history
VOLUME ["/app/data"]

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
