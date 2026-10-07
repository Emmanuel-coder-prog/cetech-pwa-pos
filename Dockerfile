FROM node:24.21.0-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
    && corepack prepare pnpm@12.4.1 --activate

WORKDIR /app


FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/pos-web/package.json ./apps/pos-web/package.json

RUN pnpm install --frozen-lockfile


FROM deps AS builder

COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_ORIGIN

ENV NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
ENV NEXT_PUBLIC_APP_ORIGIN="${NEXT_PUBLIC_APP_ORIGIN}"

RUN pnpm --dir apps/pos-web build


FROM base AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/pos-web/package.json ./apps/pos-web/package.json
COPY --from=builder --chown=node:node /app/apps/pos-web/node_modules ./apps/pos-web/node_modules
COPY --from=builder --chown=node:node /app/apps/pos-web/.next ./apps/pos-web/.next
COPY --from=builder --chown=node:node /app/apps/pos-web/public ./apps/pos-web/public

USER node

EXPOSE 3000

WORKDIR /app/apps/pos-web

CMD ["node", "node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
