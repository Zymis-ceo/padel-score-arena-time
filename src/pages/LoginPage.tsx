
import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (data: Record<string, string>) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-padel-light">
      <div className="w-full max-w-md mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-padel-primary">Padel Score</h1>
          <p className="text-gray-600">Track your padel matches and scores</p>
        </div>
        
        <AuthForm isLogin={true} onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default LoginPage;
