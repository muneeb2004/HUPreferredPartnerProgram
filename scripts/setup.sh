#!/usr/bin/env bash
# Setup local environment

pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
pnpm --filter @hu-partner/api prisma generate
echo "Setup complete."
