import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import TodoList from './components/Todos/TodoList';
import TodoForm from './components/Todos/TodoForm';
import UserList from './components/Users/UserList';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/todos" replace /> : <LoginForm />
        } 
      />
      
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? <Navigate to="/todos" replace /> : <SignupForm />
        } 
      />
      
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/todos" : "/login"} replace />
        } 
      />
      
      <Route 
        path="/todos" 
        element={
          <ProtectedRoute>
            <Layout>
              <TodoList />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/todos/new" 
        element={
          <ProtectedRoute>
            <Layout>
              <TodoForm />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/todos/:id/edit" 
        element={
          <ProtectedRoute>
            <Layout>
              <TodoForm isEdit />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/users" 
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <UserList />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/users/new" 
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <div>User Form Component (to be implemented)</div>
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;