#!/bin/sh
export PORT=${PORT:-80}
sed "s/\${PORT}/$PORT/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g 'daemon off;' &
node /app/services/authors/index.js &
node /app/services/categories/index.js &
node /app/services/books/index.js &
wait
