# Dockerfile — build Next (builder) then runtime (runner)
# Uses builder stage name 'builder' (must exist before COPY --from=builder)

# ---------- Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

# small system deps and corepack (for Yarn v3)
RUN apk add --no-cache libc6-compat
RUN corepack enable

# install deps (use immutable to respect lockfile)
COPY package.json yarn.lock .yarnrc.yml ./
# copy .yarn if present (faster / offline installs)
COPY .yarn .yarn
RUN yarn install --immutable

# copy source & run build
COPY . .
RUN yarn build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# runtime deps (no corepack enable here to avoid runtime yarn/corepack activity)
RUN apk add --no-cache libc6-compat

# create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# copy full built app from builder (ensures next.config helpers are present)
COPY --from=builder /app /app

USER nextjs
EXPOSE 8000

# run Next directly so Yarn/Corepack is not invoked at container start
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "8000"]