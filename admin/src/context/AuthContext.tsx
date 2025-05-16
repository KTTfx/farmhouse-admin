import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import apiClient from '../lib/api';

// Define the user interface based on what your backend returns
interface Admin {
  id: string;
  AdminId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isVerified: boolean;
  type: string;
  phone: string
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  Admin: Admin | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setIsLoading(true);
          // Check token validity by making a request to the backend
          const response = await apiClient.get('/users/profile');
          setAdmin(response.data.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Failed to validate token:", err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setAdmin(null);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Make the login request
      console.log("Attempting login with credentials:", credentials);
      const response = await apiClient.post('/auth/login', credentials);
      console.log("Login response:", response.data);
      
      // The backend returns the token directly in the data field
      // Note: Check your actual backend response structure
      const token = response.data.data;
      
      if (token) {
        console.log("Setting token in localStorage:", token);
        localStorage.setItem('token', token);
        
        // After getting the token, fetch the user profile
        const userResponse = await apiClient.get('/users/profile');
        setAdmin(userResponse.data.data);
        setIsAuthenticated(true);
      } else {
        throw new Error("No token received from server");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed');
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    setIsAuthenticated(false);
  };
  
  const clearError = () => setError(null);
  
  return (
    <AuthContext.Provider value={{ 
      Admin: admin, 
      isLoading, 
      error, 
      login, 
      logout, 
      clearError, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};