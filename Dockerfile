FROM docker:latest

WORKDIR /app

COPY docker-compose.yml .
COPY . .

RUN docker-compose build

CMD ["docker-compose", "up"]
