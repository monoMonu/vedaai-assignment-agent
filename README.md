# Veda AI Assignment

## Setup

1. Add the required environment variables in both `client/.env.local` and `server/.env` by copying the values from the matching `.env.example` files.
2. In both `client` and `server`, run:

```bash
npm install
npm run dev
```

3. Open the app in your browser:
- Frontend: http://localhost:3000
- Server: http://localhost:3002

## Architecture Overview

This project uses a monorepo structure with two main applications:

- `client`: A Next.js frontend responsible for the dashboard UI, assignment creation flow, paper viewer, and realtime status tracking.
- `server`: A Node.js and Express backend responsible for assignment APIs, paper generation, database access, queue processing, and websocket events.

The backend persists assignment and paper data in MongoDB, processes generation jobs through a queue, and emits realtime updates over Socket.IO. The frontend consumes these APIs, manages local UI state with Zustand, and reflects generation progress in the interface.

## Approach

The project was implemented in stages to keep the system stable while features were added incrementally:

1. Set up the monorepo and initialized the backend first with the core folder structure, dependencies, database models, queue setup, socket initialization, and the initial assignment generation endpoint.
2. Validated the backend flow early using Postman and queue-processing checks before expanding the UI.
3. Initialized the frontend with the theme, typography, and design foundation, then added the Zustand store, socket client, and shared TypeScript types.
4. Recreated the Figma design in the UI and connected the assignment generation form to the backend.
5. Returned to the backend to integrate Groq-based paper generation and added supporting APIs such as assignment listing, deletion, and paper retrieval by ID.
6. Continued frontend refinement with the paper viewer, user state, and websocket-driven realtime generation status updates through a floating status widget.
7. Finished with smaller fixes and polish across both client and server.
