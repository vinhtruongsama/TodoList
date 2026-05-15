/**
 * Các hằng số dùng chung cho toàn bộ ứng dụng EduTrack
 */

export const APP_CONFIG = {
  NAME: 'EduTrack',
  DESCRIPTION: 'Hệ thống quản lý học tập và công việc dành cho Student & Mentor',
  VERSION: '1.0.0',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TASKS: '/tasks',
  GOALS: '/goals',
  NOTES: '/notes',
  MENTORS: '/mentors', // Dành cho Student
  MENTOR_STUDENTS: '/mentor/students', // Dành cho Mentor
  REVIEWS: '/reviews',
  NOTIFICATIONS: '/notifications',
};

export const VALIDATION = {
  TITLE_MAX_LENGTH: 100,
  NOTE_CONTENT_MAX_LENGTH: 2000,
};

export const STATUS_LABELS = {
  TASK: {
    pending: 'Chưa xong',
    completed: 'Đã hoàn thành',
  },
  GOAL: {
    active: 'Đang chạy',
    completed: 'Đã đạt được',
    paused: 'Tạm dừng',
    archived: 'Đã lưu trữ',
  },
  CONNECTION: {
    pending: 'Đang chờ',
    accepted: 'Đã kết nối',
    rejected: 'Đã từ chối',
  },
};

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-blue-100 text-blue-600',
  low: 'bg-gray-100 text-gray-600',
};
