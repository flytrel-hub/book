FROM node:20-alpine

WORKDIR /app

RUN npm install -g concurrently

COPY services/authors/package*.json ./services/authors/
COPY services/categories/package*.json ./services/categories/
COPY services/books/package*.json ./services/books/

RUN cd services/authors && npm install --omit=dev
RUN cd services/categories && npm install --omit=dev
RUN cd services/books && npm install --omit=dev

COPY services/ ./services/
COPY public/ ./public/

EXPOSE 3001 3002 3003

CMD ["concurrently", "node services/authors/index.js", "node services/categories/index.js", "node services/books/index.js"]
