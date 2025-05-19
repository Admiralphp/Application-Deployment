FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Declare the build argument
ARG REACT_APP_API_URL
# Set the environment variable from the build argument so npm run build can use it
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]