FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN addgroup --system --gid 10001 app \
    && adduser --system --uid 10001 \
        --shell /sbin/false \
        --disabled-login --ingroup app \
        --no-create-home --home /app  \
        app \
    && mkdir /var/run/app \
    && chown app:app /var/run/app \
    && npm run build

ENV PORT=8080
EXPOSE 8080

USER app

CMD ["server.js"]
