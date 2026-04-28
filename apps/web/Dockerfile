# Production web image — built from the monorepo root
# Build: docker build -f apps/web/Dockerfile -t farscry-web .

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /workspace

# ─── Install workspace dependencies ─────────────────────────────────────────
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/mobile/package.json ./apps/mobile/
COPY apps/desktop/package.json ./apps/desktop/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/
COPY tools/project-plugin/package.json ./tools/project-plugin/
RUN pnpm install --frozen-lockfile=false --filter @my-app/web... --filter @project/shared

# ─── Build static SPA ───────────────────────────────────────────────────────
FROM deps AS build
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
WORKDIR /workspace/apps/web
RUN pnpm exec vite build

# ─── Caddy serves the built app + proxies API ───────────────────────────────
FROM caddy:2-alpine AS runtime
COPY apps/web/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /workspace/apps/web/dist /usr/share/caddy
EXPOSE 80
