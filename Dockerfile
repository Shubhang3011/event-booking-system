# Single-service image: one container that builds the React app, builds the API,
# and serves BOTH (the API under /api, the SPA everywhere else). Ideal for a
# simple one-service deploy (e.g. Render). Build context = repo root.

# --- 1. Build the frontend -------------------------------------------------
FROM node:22-alpine AS web-build
WORKDIR /web
COPY web/package.json ./
RUN npm install
COPY web/ ./
RUN npm run build

# --- 2. Build the backend --------------------------------------------------
FROM node:22-alpine AS server-build
WORKDIR /server
COPY server/package.json ./
RUN npm install
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build && npm prune --omit=dev

# --- 3. Runtime ------------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
# Tells the API to also serve the built SPA from this path.
ENV CLIENT_DIST=/app/web/dist

COPY --from=server-build /server/node_modules ./node_modules
COPY --from=server-build /server/dist ./dist
COPY --from=server-build /server/package.json ./
COPY --from=web-build /web/dist ./web/dist

EXPOSE 4000
USER node
CMD ["node", "dist/index.js"]
