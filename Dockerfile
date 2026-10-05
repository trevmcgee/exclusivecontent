FROM node:20-alpine AS builder
WORKDIR /app/web

COPY web/package.json ./
RUN npm install

COPY web/ ./
COPY data/ /app/data/
ENV DASHBOARD_DATA_PATH=/app/data/dashboard.json

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
ENV DASHBOARD_DATA_PATH=/app/data/dashboard.json

COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./.next/static
COPY data /app/data

EXPOSE 8080
CMD ["node", "server.js"]
