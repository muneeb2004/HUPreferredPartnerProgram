import { defineConfig } from '@prisma/config';

export default defineConfig({
  studio: {
    port: 5555,
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/hupreferredpartner",
  }
});
