# Security Standards

1. **Authentication**: JWT-based auth via HttpOnly cookies for web, Bearer tokens for API.
2. **Authorization**: Strict RBAC checking in NestJS Guards.
3. **Input Validation**: Use `class-validator` in NestJS and Zod in Next.js.
4. **Secrets**: Never commit `.env` files. Use AWS Secrets Manager in production.
