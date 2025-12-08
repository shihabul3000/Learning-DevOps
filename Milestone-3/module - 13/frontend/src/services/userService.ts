import { api } from './api';
import { User, ApiResponse } from '../types';

export const userService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};