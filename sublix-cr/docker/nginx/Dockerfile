# ─────────────────────────────────────────────────────────────────────────────
# docker/nginx/Dockerfile  —  Nginx reverse proxy (production only)
# ─────────────────────────────────────────────────────────────────────────────

FROM nginx:1.27-alpine

# Remove default config and replace with ours
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
