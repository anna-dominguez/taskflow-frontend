// Types pour l'API
export interface Category {
  id: number;
  name: string;
  tasks_count: number;
}

export interface Task {
  id: number;
  description: string;
  is_completed: boolean;
  created_at: string;
  category: number;
  category_name: string;
}

export interface ApiError {
  [key: string]: string[];
}
