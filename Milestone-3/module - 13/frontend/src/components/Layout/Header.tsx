import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Users, CheckSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Todo App
          </Link>
          
          {isAuthenticated && (
            <nav className="flex items-center space-x-6">
              <Link 
                to="/todos" 
                className="flex items-center space-x-1 hover:text-blue-200"
              >
                <CheckSquare size={18} />
                <span>Todos</span>
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/users" 
                  className="flex items-center space-x-1 hover:text-blue-200"
                >
                  <Users size={18} />
                  <span>Users</span>
                </Link>
              )}
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User size={18} />
                  <span>{user?.name}</span>
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                    {user?.role}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 hover:text-blue-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;