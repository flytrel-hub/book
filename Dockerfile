FROM node:20-alpine AS builder

WORKDIR /app

COPY services/authors/package*.json ./services/authors/
COPY services/categories/package*.json ./services/categories/
COPY services/books/package*.json ./services/books/

RUN cd services/authors && npm install --omit=dev
RUN cd services/categories && npm install --omit=dev
RUN cd services/books && npm install --omit=dev

COPY services/ ./services/
COPY public/ ./public/

FROM nginx:alpine

RUN apk add --no-cache nodejs

WORKDIR /app

COPY --from=builder /app /app
COPY gateway/nginx-railway.conf /etc/nginx/nginx.conf.template
COPY gateway/start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]
