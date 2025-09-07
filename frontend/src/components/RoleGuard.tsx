'use client';

import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <div>You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
};

export default RoleGuard;