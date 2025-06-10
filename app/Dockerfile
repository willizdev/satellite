FROM oven/bun:alpine

WORKDIR /root/satellite/app
COPY . .

RUN bun install
RUN bun run build
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
