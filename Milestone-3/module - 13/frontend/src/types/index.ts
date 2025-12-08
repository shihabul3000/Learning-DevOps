export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  age?: number;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}