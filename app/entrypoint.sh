#!/bin/sh
bun run db:generate
bun run db:migrate
bun run start
