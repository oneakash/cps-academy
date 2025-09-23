'use client';

import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, fallback }) => {
  const { user } = useAuth();

  // Allow admin access to everything
  if (user?.role?.type === 'admin' || user?.role?.name === 'Super Admin') {
    return <>{children}</>;
  }

  if (!user) {
    return fallback || (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">Please log in to access this content.</p>
      </div>
    );
  }

  const userRoleName = user.role?.type || user.role?.name || 'authenticated';
  
  if (!allowedRoles.includes(userRoleName)) {
    return fallback || (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">You don't have permission to access this content.</p>
        <p className="text-red-600 text-sm mt-1">Required roles: {allowedRoles.join(', ')}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;