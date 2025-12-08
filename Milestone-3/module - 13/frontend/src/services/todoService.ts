import { api } from './api';
import { Todo, ApiResponse } from '../types';

export const todoService = {
  getTodos: async (): Promise<ApiResponse<Todo[]>> => {
    const response = await api.get('/todos');
    return response.data;
  },

  getTodoById: async (id: number): Promise<ApiResponse<Todo>> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (todoData: Partial<Todo>): Promise<ApiResponse<Todo>> => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  updateTodo: async (id: number, todoData: Partial<Todo>): Promise<ApiResponse<Todo>> => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  deleteTodo: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  }
};