import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { API_EVENT_UNAUTHORIZED, apiGet } from '../lib/api';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isSetup: boolean | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkSetupStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('ups_token'));
  const [user, setUser] = useState<User | null>(
    localStorage.getItem('ups_user') ? JSON.parse(localStorage.getItem('ups_user')!) : null
  );
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSetupStatus = async () => {
    try {
      const res = await fetch('/api/auth/setup-status');
      const data = await res.json();
      setIsSetup(data.isSetup);
    } catch (err) {
      console.error('Failed to check setup status', err);
      // Fallback or retry logic if needed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSetupStatus();

    // Listen for unauthorized events to logout automatically
    const handleUnauthorized = () => logout();
    window.addEventListener(API_EVENT_UNAUTHORIZED, handleUnauthorized);

    // Validate token on mount
    if (token) {
      apiGet('/api/auth/me').catch(() => {
        logout();
      });
    }

    return () => {
      window.removeEventListener(API_EVENT_UNAUTHORIZED, handleUnauthorized);
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('ups_token', newToken);
    localStorage.setItem('ups_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ups_token');
    localStorage.removeItem('ups_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isSetup, isLoading, login, logout, checkSetupStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
