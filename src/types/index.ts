/**
 * Hệ thống Type trung tâm cho toàn bộ dự án EduTrack
 */

// --- Roles & Auth ---
export type UserRole = 'student' | 'mentor';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

// --- Tasks ---
export type TaskStatus = 'pending' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  goal_id?: string | null;
  title: string;
  description?: string;
  due_date: string;
  status: TaskStatus;
  priority: Priority;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// --- Goals & Steps ---
export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';
export type StepStatus = 'pending' | 'completed';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: GoalStatus;
  progress_percent: number;
  created_at: string;
  updated_at: string;
}

export interface GoalStep {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: StepStatus;
  order_index: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// --- Notes ---
export interface LearningNote {
  id: string;
  user_id: string;
  task_id?: string;
  goal_id?: string;
  goal_step_id?: string;
  title: string;
  content: string;
  note_date: string;
  created_at: string;
  updated_at: string;
}

// --- Connections ---
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

export interface MentorStudentLink {
  id: string;
  mentor_id?: string;
  mentor_email: string;
  student_id: string;
  status: ConnectionStatus;
  invited_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
  // Join fields
  profiles?: {
    full_name: string;
  };
}

// --- Reviews ---
export type ReviewTargetType = 'dashboard' | 'task' | 'goal' | 'note';

export interface MentorReview {
  id: string;
  mentor_id: string;
  student_id: string;
  target_type: ReviewTargetType;
  target_id?: string;
  comment: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  // Join fields
  profiles?: {
    full_name: string;
  };
}
// --- Notifications ---
export type NotificationType = 'new_review' | 'new_invitation' | 'invitation_accepted' | 'system';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// --- Task History ---
export type TaskHistoryEventType = 'completed' | 'reflection' | 'skipped_reflection' | 'updated' | 'reopened';
export type TaskDifficulty = 'easy' | 'normal' | 'hard';

export interface TaskHistory {
  id: string;
  task_id: string;
  user_id: string;
  event_type: TaskHistoryEventType;
  content?: string;
  duration_minutes?: number;
  mood?: string;
  difficulty?: TaskDifficulty;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskHistoryInput {
  task_id: string;
  event_type: TaskHistoryEventType;
  content?: string;
  duration_minutes?: number;
  mood?: string;
  difficulty?: TaskDifficulty;
}

// --- Activities (Momentum Engine) ---
export type ActivityType = 
  | 'task_completed' 
  | 'task_reflection' 
  | 'note_created' 
  | 'mentor_review_received';

export interface ActivityMetadata {
  task_title?: string;
  note_title?: string;
  content_preview?: string;
  comment_preview?: string;
  mentor_name?: string;
  [key: string]: any;
}

export interface AppActivity {
  id: string;
  user_id: string;
  actor_id?: string | null;
  type: ActivityType;
  target_id: string;
  metadata: ActivityMetadata;
  created_at: string;
}
