FROM node:16-alpine

WORKDIR /app

COPY server.js package.json ./

RUN npm install express cors http-proxy-middleware morgan

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]