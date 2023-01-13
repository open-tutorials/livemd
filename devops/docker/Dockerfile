FROM node:19.4-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN groupadd --system --gid 10001 app \
    && useradd --system --uid 10001 --no-log-init -g app app \
    && mkdir /var/run/app \
    && chown app:app /var/run/app \
    && npm run build

ENV PORT=8080
EXPOSE 8080

USER app

CMD ["server.js"]
