'use client';

import type React from 'react';

import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from './login-form';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-primary' />
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasPermission = requiredPermissions.some((permission) =>
      user.permissions.includes(permission)
    );
    if (hasPermission) {
      return (
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-2'>Access Denied</h2>
            <p className='text-muted-foreground'>
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
