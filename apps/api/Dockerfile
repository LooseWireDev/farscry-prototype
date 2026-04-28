# Production API image — built from the monorepo root
# Build: docker build -f apps/api/Dockerfile -t farscry-api .

FROM node:22-alpine AS base
RUN apk add --no-cache wget && corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /workspace

# ─── Install workspace dependencies (cached layer) ──────────────────────────
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
RUN pnpm install --frozen-lockfile=false --filter @my-app/api... --filter @project/shared

# ─── Production runtime ─────────────────────────────────────────────────────
FROM base AS runtime
COPY --from=deps /workspace ./
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
WORKDIR /workspace/apps/api

ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -q --spider http://localhost:3000/trpc/health || exit 1
CMD ["pnpm", "exec", "tsx", "src/index.ts"]
