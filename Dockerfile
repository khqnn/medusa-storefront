FROM alpine AS base
RUN apk add --no-cache --update yarn nodejs
RUN yarn global add corepack
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "8000"]
