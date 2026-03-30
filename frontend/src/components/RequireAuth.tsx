import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';

export function RequireAuth() {
  const { token, isSetup, isLoading } = useAuth();

  if (isLoading || isSetup === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spin size="large" />
      </div>
    );
  }

  if (isSetup === false) {
    return <Navigate to="/setup" replace />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
