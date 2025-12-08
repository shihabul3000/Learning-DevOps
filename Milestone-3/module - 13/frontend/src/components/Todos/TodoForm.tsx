import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { todoService } from '../../services/todoService';
import { Todo } from '../../types';

interface TodoFormData {
  title: string;
  description: string;
  due_date: string;
}

interface TodoFormProps {
  todo?: Todo;
  isEdit?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, isEdit = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TodoFormData>({
    defaultValues: {
      title: todo?.title || '',
      description: todo?.description || '',
      due_date: todo?.due_date || ''
    }
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: TodoFormData) => {
      if (isEdit && todo) {
        return todoService.updateTodo(todo.id, data);
      } else {
        return todoService.createTodo(data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
        navigate('/todos');
      }
    }
  );

  const onSubmit = (data: TodoFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEdit ? 'Edit Todo' : 'Create New Todo'}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter todo title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter todo description"
          />
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            {...register('due_date')}
            type="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/todos')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isLoading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;