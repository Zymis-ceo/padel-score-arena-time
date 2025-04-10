
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('padelUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      // In a real app, this would be an actual API call to a backend
      console.log('Logging in with:', email, password);
      
      // Mock user for demo purposes
      if (email && password) {
        const mockUser = {
          id: '1',
          email,
          name: email.split('@')[0],
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('padelUser', JSON.stringify(mockUser));
        
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call
      console.log('Registering with:', name, email, password);
      
      // Mock user creation
      if (name && email && password) {
        const mockUser = {
          id: Date.now().toString(),
          email,
          name,
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('padelUser', JSON.stringify(mockUser));
        
        toast.success('Registered successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Please fill in all fields');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('padelUser');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
