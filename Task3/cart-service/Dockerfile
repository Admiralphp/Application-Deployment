FROM node:16-alpine

WORKDIR /app

COPY server.js ./
COPY package.json ./

RUN npm install express redis util axios express-session connect-redis

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost:4000/health || exit 1

CMD ["node", "server.js"]