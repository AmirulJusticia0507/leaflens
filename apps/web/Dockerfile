# ---- Base ----
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate
WORKDIR /app

# ---- Deps ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app ./
COPY . .
RUN ls -la apps/web/components/ | head -n 20 && ls -la apps/web/app/ | head -n 20
RUN pnpm --filter @leaflens/web build

# ---- Runner ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["pnpm", "--filter", "@leaflens/web", "start"]
