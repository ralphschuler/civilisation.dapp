# node:22-alpine
FROM node:25-alpine@sha256:bdf2cca6fe3dabd014ea60163eca3f0f7015fbd5c7ee1b0e9ccb4ced6eb02ef4 AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.21.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY public ./public
COPY server ./server
COPY scripts/db-migrate.mjs ./scripts/db-migrate.mjs
COPY scripts/run-chain-indexer.mjs ./scripts/run-chain-indexer.mjs
COPY scripts/release-worldchain-gate.mjs ./scripts/release-worldchain-gate.mjs
COPY scripts/verify-worldchain-proxy.mjs ./scripts/verify-worldchain-proxy.mjs
COPY scripts/lib/migrations.mjs ./scripts/lib/migrations.mjs
COPY migrations ./migrations
COPY src ./src
COPY next.config.ts tsconfig.json postcss.config.mjs ./
# Next evaluates header configuration while producing the standalone build.
# These are intentionally unset by default: report-only CSP is safe by default,
# while HSTS and enforcement require explicit deployment build arguments.
ARG CIVILIZATION_ENV
ARG CIVILIZATION_CSP_MODE
ARG CIVILIZATION_HSTS_ENABLED
ENV CIVILIZATION_ENV=$CIVILIZATION_ENV
ENV CIVILIZATION_CSP_MODE=$CIVILIZATION_CSP_MODE
ENV CIVILIZATION_HSTS_ENABLED=$CIVILIZATION_HSTS_ENABLED
RUN pnpm build

# node:22-alpine
FROM node:25-alpine@sha256:bdf2cca6fe3dabd014ea60163eca3f0f7015fbd5c7ee1b0e9ccb4ced6eb02ef4 AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=31057
ENV HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build --chown=node:node /app/scripts/db-migrate.mjs ./scripts/db-migrate.mjs
COPY --from=build --chown=node:node /app/scripts/release-worldchain-gate.mjs ./scripts/release-worldchain-gate.mjs
COPY --from=build --chown=node:node /app/scripts/verify-worldchain-proxy.mjs ./scripts/verify-worldchain-proxy.mjs
COPY --from=build --chown=node:node /app/scripts/lib/migrations.mjs ./scripts/lib/migrations.mjs
# The finalized-replay CLI is opt-in: it is available only when an operator
# explicitly overrides the image command with this script.
COPY --from=build --chown=node:node /app/scripts/run-chain-indexer.mjs ./scripts/run-chain-indexer.mjs
COPY --from=build --chown=node:node /app/migrations ./migrations
COPY --from=build --chown=node:node /app/src/lib/database.mjs ./src/lib/database.mjs
COPY --from=build --chown=node:node /app/src/lib/database-connect.mjs ./src/lib/database-connect.mjs
COPY --from=build --chown=node:node /app/src/lib/runtime-config.ts ./src/lib/runtime-config.ts
COPY --from=build --chown=node:node /app/src/world-chain.js ./src/world-chain.js
COPY --from=build --chown=node:node /app/server/contract-runtime-status.js ./server/contract-runtime-status.js
COPY --from=build --chown=node:node /app/server/production-release-gate.js ./server/production-release-gate.js
COPY --from=build --chown=node:node /app/server/chain-indexer-core.js ./server/chain-indexer-core.js
COPY --from=build --chown=node:node /app/server/chain-indexer-store.js ./server/chain-indexer-store.js
COPY --from=build --chown=node:node /app/server/chain-indexer-reader.js ./server/chain-indexer-reader.js
USER node
EXPOSE 31057
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:31057/api/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
