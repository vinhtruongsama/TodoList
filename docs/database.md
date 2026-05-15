# Database & RLS Overview

## 📊 Schema
- `profiles`: User roles (student/mentor).
- `tasks`: Daily todo items.
- `goals`: Long-term targets.
- `goal_steps`: Breakdown of goals.
- `learning_notes`: Knowledge capture.
- `mentor_student_links`: Connection management.

## 🛡️ RLS Policies (Row Level Security)

### 1. Ownership Policy
All user data (`tasks`, `goals`, `notes`, `goal_steps`) is protected by:
```sql
USING (auth.uid() = user_id)
```

### 2. Mentor Access Policy
Mentors can only view data if they are connected:
```sql
USING (
  EXISTS (
    SELECT 1 FROM mentor_student_links
    WHERE student_id = [TABLE].user_id
    AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
    AND status = 'accepted'
  )
)
```

### 3. Connection Policy
- Students can create and view invitations.
- Mentors can view and update (accept/reject) invitations sent to them.

## ⚙️ Automated Logic
- `updated_at`: Triggered automatically on any row update.
- `progress_percent`: Goal progress is calculated via SQL trigger when steps change.
- `profiles`: Created automatically via Trigger on Supabase Auth Signup.
