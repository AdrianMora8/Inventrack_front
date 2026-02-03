import React from 'react';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-dark-300 border-b border-dark-200">
      <div className="flex-1 px-6 flex justify-between items-center">
        {/* Page title placeholder */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
        </div>
        
        {/* User menu */}
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="h-8 w-8 text-text-secondary" />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary">{user?.email || 'Usuario'}</p>
              <p className="text-xs text-text-secondary capitalize">{user?.role || 'Staff'}</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-dark-100 transition-colors"
            title="Cerrar sesión"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
