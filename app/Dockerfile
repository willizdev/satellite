FROM oven/bun:alpine

WORKDIR /root/wmarket/web
COPY . .

RUN bun install
RUN bun run build

CMD ["bun", "run", "start"]
