# ── Stage 1: Build React app ──────────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Accept the backend API URL as a build argument (set this in Railway dashboard)
ARG REACT_APP_API_BASE_URL=http://localhost:5000
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────────────────────
FROM nginx:alpine

# Install envsubst (comes with gettext) so we can substitute $PORT at runtime
RUN apk add --no-cache gettext

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway injects $PORT at runtime; envsubst will replace it in the config
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]