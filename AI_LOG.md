# AI Use Log

[cite_start]In accordance with the assessment guidelines, this document outlines my use of AI tools during the development of this project[cite: 80, 89]. [cite_start]The AI wrote portions of the code, and I actively reviewed, tested, and modified it to meet the specific requirements[cite: 92].

### Tool Used

- [cite_start]**Gemini** (Google) [cite: 88]

### How It Was Used

**1. Backend Architecture & RBAC (Bonus B)**

- [cite_start]**What the AI generated:** The initial NestJS scaffolding, Mongoose schemas, and the template for the `RolesGuard`[cite: 25, 58].
- **My review and modifications:** I reviewed the initial CRUD output and realized the AI did not automatically link tasks to the authenticated user. [cite_start]I prompted the AI to refactor the `Task` schema to include a `User` reference[cite: 31]. [cite_start]I also manually refined the `RolesGuard` to ensure it strictly threw a **403 Forbidden** error for unauthorized Member actions rather than a 404, satisfying the specific Bonus B requirements[cite: 60].

**2. Authentication & Database Seeding**

- [cite_start]**What the AI generated:** The JWT authentication flow and a basic lifecycle hook for database initialization[cite: 26].
- **My review and modifications:** I modified the seeding logic to check specifically for the presence of an Admin user rather than just an empty database. [cite_start]This ensured that the mandatory Admin (`admin@test.com`) and two Member accounts were consistently available for reviewer testing without manual setup[cite: 61, 62].

**3. Frontend UI & State Management**

- [cite_start]**What the AI generated:** The Next.js pages for Login, Register, and the Task Dashboard using Tailwind CSS[cite: 35, 36, 37].
- **My review and modifications:** I identified and fixed a UI bug where the Tailwind placeholder text was illegible due to system dark-mode conflicts. [cite_start]I enforced a consistent light theme in `globals.css` to ensure a "clean and readable UI" that prioritized functional clarity[cite: 39]. [cite_start]I also implemented the filtering and sorting logic to meet the core API requirements[cite: 38].

**4. Containerization (Docker Compose)**

- [cite_start]**What the AI generated:** Standard Dockerfiles and a `docker-compose.yml` template[cite: 82].
- **My review and modifications:** I updated the base images to use **Node 22-Alpine** to match my local development environment. [cite_start]I also configured the Docker networking to ensure the frontend could correctly resolve the backend API across containers[cite: 40].

**5. Documentation**

- [cite_start]**What the AI generated:** Initial drafts for `ARCHITECTURE.md` and `README.md`[cite: 63, 71, 75].
- [cite_start]**My review and modifications:** I extensively edited these drafts to include technical explanations of the RBAC logic, JWT role embedding, and Docker orchestration to ensure the reviewers had a clear understanding of the full-stack system[cite: 12, 17, 94].
