import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { CheckCircle, Circle, Edit, Trash2, Calendar } from 'lucide-react';
import { Todo } from '../../types';
import { todoService } from '../../services/todoService';
import { Link } from 'react-router-dom';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation(
    () => todoService.updateTodo(todo.id, { completed: !todo.completed }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
      }
    }
  );

  const deleteMutation = useMutation(
    () => todoService.deleteTodo(todo.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
      }
    }
  );

  const handleToggle = () => {
    toggleMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
      todo.completed ? 'border-green-500' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleToggle}
            className="mt-1 text-gray-400 hover:text-blue-500"
            disabled={toggleMutation.isLoading}
          >
            {todo.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={`mt-1 text-sm ${
                todo.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {todo.description}
              </p>
            )}
            
            {todo.due_date && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Due: {new Date(todo.due_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/todos/${todo.id}/edit`}
            className="text-gray-400 hover:text-blue-500"
          >
            <Edit className="h-4 w-4" />
          </Link>
          
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
            disabled={deleteMutation.isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;