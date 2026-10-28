import { useState } from 'react';

/**
 * Hook to retrieve current user info & authentication state from localStorage
 */
export function useAuth() {
  const [user] = useState(() => {
    try {
      const saved = localStorage.getItem('user') || localStorage.getItem('customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(user);
  const role = user?.role || 'GUEST';

  return {
    user,
    isAuthenticated,
    role,
    isAdmin: role === 'ADMIN',
    isEmployee: role === 'EMPLOYEE',
    isCustomer: role === 'CUSTOMER' || role === 'USER',
  };
}

export default useAuth;
