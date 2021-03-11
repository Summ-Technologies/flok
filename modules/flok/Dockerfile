FROM tiangolo/node-frontend:10 as node-builder
WORKDIR /app/
COPY ./ ./
RUN npm install
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
# COPY --from=node-builder /app/docker-scripts/setup_config.sh /docker-entrypoint.d/setup_config.sh
COPY --from=node-builder /app/public/ ./
COPY --from=node-builder /app/build/ ./
COPY --from=node-builder /nginx.conf /etc/nginx/conf.d/default.conf
