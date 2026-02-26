# Architecture Document

## 1. System Overview

This is a containerized full-stack Task Management application designed for secure, multi-role task handling.

1. **Frontend (Next.js):** A React-based interface using Tailwind CSS and an Axios interceptor for automated JWT handling.
2. **Backend (NestJS):** A modular API enforcing Role-Based Access Control (RBAC) and JWT authentication.
3. **Database (MongoDB):** Persistent storage for users and tasks, utilizing Mongoose for schema modeling.
4. **Orchestration (Docker):** The entire stack is containerized using Docker Compose for consistent environment parity (Node 22).

## 2. Folder Structure

The project is organized into two main services at the root:

- **`/frontend`:** Next.js App Router structure.
  - `src/lib/api.ts`: Centralized Axios instance with request interceptors.
- **`/backend`:** NestJS domain-driven modules.
  - `src/auth`: Identity management, JWT strategy, and RolesGuard.
  - `src/tasks`: Task logic with permission-aware services.
- **Root:** Contains `docker-compose.yml` to orchestrate the services and MongoDB.

## 3. Database Schema

**User Schema**

```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // Hashed via bcrypt

  @Prop({ required: true, enum: ["admin", "member"], default: "member" })
  role: string; // Bonus B: RBAC requirement
}
```

**Task Schema**

```typescript
@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ required: true, type: Date })
  dueDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: User; // Relational link for ownership and RBAC scoping
}
```

## 4. API Endpoints

| Method | Path             | Auth | Roles  | Description                                    |
| :----- | :--------------- | :--- | :----- | :--------------------------------------------- |
| POST   | `/auth/register` | No   | All    | Standard registration (defaults to 'member').  |
| POST   | `/auth/login`    | No   | All    | Returns JWT with embedded role.                |
| GET    | `/tasks`         | Yes  | Member | Returns only tasks owned by the user.          |
| GET    | `/tasks`         | Yes  | Admin  | Returns all tasks in the database.             |
| PATCH  | `/tasks/:id`     | Yes  | Member | Updates own task; returns 403 if unauthorized. |
| PATCH  | `/tasks/:id`     | Yes  | Admin  | Can update any task (e.g., re-assigning).      |
| DELETE | `/tasks/:id`     | Yes  | Admin  | Only Admins can perform hard deletes.          |

## 5. Auth & RBAC Flow (Bonus B)

Authentication and Authorization are enforced at the API level:

1. **JWT Strategy:** Upon login, the user's `role` is embedded in the JWT payload.
2. **RolesGuard:** A custom `RolesGuard` extracts the role from the validated token. It compares this against metadata provided by the `@Roles()` decorator.
3. **Permission Scoping:** - Members are restricted via the `TasksService` using `user._id` in Mongoose queries.
   - Unauthorized attempts (e.g., a Member trying to GET an Admin's task) return a **403 Forbidden** rather than a 404, ensuring the API distinguishes between "not found" and "not allowed."

## 6. AI Tools Used

- **Tool:** Gemini
- **Usage:** Assisted in generating NestJS module templates and Tailwind layouts.
- **Review & Changes:** I manually refactored the AI's standard `AuthGuard` implementation to include the `RolesGuard`. I also corrected the database seeding logic to ensure that a default Admin account is generated on the first run of the Docker container, enabling immediate testing of RBAC features.

## 7. Decisions & Trade-offs

- **Decision: Docker Compose with Node 22-Alpine.**
  - _Why:_ To match the developer's local environment precisely while keeping the image size small for faster deployment.
- **Decision: RBAC enforcement in the Service layer.**
  - _Why:_ While Guards handle route-level access, enforcing ownership in the service layer ensures that Members cannot manipulate other users' data even if they guess a valid Task ID.
- **Trade-off: Local JWT Storage.**
  - _Improvement:_ For production, I would migrate to HttpOnly Cookies to mitigate XSS risks, but kept localStorage for this assessment to maintain a clear, testable integration for the frontend reviewer.
