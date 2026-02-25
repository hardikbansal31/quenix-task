# AI Use Log

In accordance with the assessment guidelines, this document outlines my use of AI tools during the development of this project. [cite_start]The AI wrote portions of the code, and I actively reviewed, tested, and modified it to meet the specific requirements[cite: 92].

### Tool Used

- **Gemini** (Google)

### How It Was Used

**1. Backend Architecture & Boilerplate**

- **What the AI generated:** The initial NestJS scaffolding, Mongoose schemas, DTO validation classes using `class-validator`, and the standard CRUD operations in the Tasks service.
- **My review and modifications:** I reviewed the initial CRUD output and realized the AI did not automatically link the created tasks to the authenticated user. I prompted the AI to refactor the `Task` schema to include a reference to the `User` schema, implement a custom `@GetUser()` decorator, and rewrite the database queries to ensure users could only view and manage their own tasks. I also manually enabled CORS in the `main.ts` file to allow the frontend to communicate with the backend.

**2. Authentication Flow**

- **What the AI generated:** The JWT authentication flow, including password hashing with `bcrypt` and the `JwtStrategy` for Passport.
- **My review and modifications:** I verified the flow via Postman to ensure route protection was working correctly and that unauthorized requests were properly rejected with a 401 status code before connecting it to the frontend.

**3. Frontend UI & State Management**

- **What the AI generated:** The Next.js pages (Login, Register, Dashboard) using Tailwind CSS, and the Axios interceptor logic for token management.
- **My review and modifications:** I reviewed the client-side routing and state management. I noticed an issue where the Tailwind CSS placeholder text was illegible due to a conflict with system dark-mode preferences. I debugged this and modified the `globals.css` file to enforce a consistent light theme, ensuring the UI remained clean and functional as required by the prompt.

**4. Documentation**

- **What the AI generated:** Drafts for the `ARCHITECTURE.md` and `README.md` files.
- **My review and modifications:** I reviewed the generated text to ensure it accurately reflected the final folder structure, database schemas, and decisions made during the build process.