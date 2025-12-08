import React from 'react';
import { useQuery } from 'react-query';
import { Plus } from 'lucide-react';
import { todoService } from '../../services/todoService';
import TodoItem from './TodoItem';
import { Link } from 'react-router-dom';

const TodoList: React.FC = () => {
  const { data: todosResponse, isLoading, error } = useQuery(
    'todos',
    todoService.getTodos
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading todos. Please try again.
      </div>
    );
  }

  const todos = todosResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
        <Link
          to="/todos/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Todo
        </Link>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No todos yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;