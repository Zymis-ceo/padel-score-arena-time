
import React from 'react';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = (data: Record<string, string>) => {
    register(data.name, data.email, data.password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-padel-light">
      <div className="w-full max-w-md mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-padel-primary">Padel Score</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        
        <AuthForm isLogin={false} onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default RegisterPage;
