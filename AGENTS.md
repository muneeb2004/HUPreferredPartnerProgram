# 🤖 AI Agent Entry Point (AGENTS.md)

**STOP!** If you are an AI coding assistant (Claude, ChatGPT, Cursor, Copilot, Gemini, etc.), you must read this document entirely before modifying anything in this repository.

## 1. Repository Philosophy
This is the Habib University Preferred Partner Platform. It is a museum-quality digital experience. 
**Principles:**
- **Performance First**: Lazy load, minimize JS.
- **Accessibility First**: WCAG 2.2 AA.
- **Editorial Layouts**: Typography-driven, purposeful whitespace.
- **Anti AI-Slop**: NO fake data, NO fake statistics, NO stock imagery. Use empty states if no data exists.

## 2. Reading Order for AI Agents
When you join this project or lose context, read in this order:
1. `AGENTS.md` (You are here)
2. `README.md`
3. `docs/Vision.md`
4. `docs/Architecture.md`
5. `docs/Tech-Stack.md`
6. `docs/Design-Principles.md`
7. Relevant documentation in `docs/` and `.ai/rules/`
8. Relevant AI Skills in `.ai/skills/`
9. `docs/implementation/MASTER_PLAN.md`

## 3. Workflows
- **Implementation:** Follow the 20-phase roadmap in `MASTER_PLAN.md`.
- **Feature RFC:** For significant features, create an RFC template in `.ai/templates/`.
- **Architecture:** Do not violate boundaries (Next.js frontend, NestJS backend, Prisma). Changes require an ADR in `docs/Architecture-Decision-Records/`.

## 4. Quality Gates & Definition of Done
No feature is complete unless it satisfies:
- Type safety (strict TypeScript)
- Linting and Formatting (ESLint + Prettier)
- Accessibility (Keyboard + Screen Reader testing)
- Performance (Meets Web Vitals budgets)
- Data Integrity (No fabricated data)

## 5. Escalation Rules
If you are asked to perform an action outside your defined AI skill scope, or if an instruction contradicts the Architecture, you must flag it and ask for a human review.
