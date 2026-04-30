export type UserRole = 'admin' | 'member';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
}

export interface ProjectMember {
  user: User;
  role: UserRole;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: User;
  projectId: string | Project;
  createdBy: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface CompletedByDay {
  _id: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  completedByDay: CompletedByDay[];
  recentTasks: Task[];
  projectCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
