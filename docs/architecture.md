# EduTrack Architecture Overview

## 🏛️ Core Principles
- **Next.js App Router**: Optimized for performance and SEO.
- **Clean Architecture**: Separation of concerns between UI, Business Logic (Services), and Data (Supabase).
- **Mobile-First Design**: Primary focus on mobile UX with desktop scaling.
- **Strict Security**: Row Level Security (RLS) on every table.

## 📂 Folder Structure
- `src/app`: Routes and page layouts.
- `src/components`: Reusable UI components.
  - `ui`: Base components (shadcn/ui).
  - `layout`: App-wide layout components (Sidebar, BottomNav).
  - `tasks/goals/notes/dashboard`: Feature-specific components.
- `src/services`: Server actions for database interaction.
- `src/lib`: Utilities, constants, and shared logic.
- `src/types`: Centralized TypeScript interfaces and enums.
- `supabase/migrations`: Database schema evolution.

## 🔐 Security (RLS)
Every table has RLS enabled.
- **Student**: Can only view/edit their own data.
- **Mentor**: Can only view student data IF a connection is `accepted`.
- **Public**: No access to private data.

## 🚦 Application State
- **Server State**: Managed by Next.js Server Actions and `revalidatePath`.
- **Client State**: Minimal local state (React `useState`) for UI interaction.
- **Auth**: Supabase Auth with Middleware protection.
