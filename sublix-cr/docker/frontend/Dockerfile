# ─────────────────────────────────────────────────────────────────────────────
# docker/frontend/Dockerfile  —  Next.js container
#
# Two-stage build:
#   Stage 1 (deps)    → install node_modules
#   Stage 2 (runtime) → dev server or production standalone output
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci


# ── Stage 2: Development / Production runner ──────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy installed modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source
COPY . .

EXPOSE 3000

# Development: hot reload via Next.js dev server
# In production, override with: npm run start (after npm run build)
CMD ["npm", "run", "dev"]
