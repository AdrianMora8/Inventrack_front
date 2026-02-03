import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  HomeIcon,
  CubeIcon,
  FolderIcon,
  ArchiveBoxIcon,
  BellAlertIcon,
  EnvelopeIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Productos', href: '/products', icon: CubeIcon },
  { name: 'Categorías', href: '/categories', icon: FolderIcon },
  { name: 'Inventario', href: '/inventory', icon: ArchiveBoxIcon },
  { 
    name: 'Alertas', 
    icon: BellAlertIcon,
    children: [
      { name: 'Ver Alertas', href: '/alerts' },
      { name: 'Configurar Reglas', href: '/alerts/rules' },
    ]
  },
  { name: 'Emails', href: '/emails', icon: EnvelopeIcon },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [alertsExpanded, setAlertsExpanded] = useState(
    location.pathname.startsWith('/alerts')
  );
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-dark-300 overflow-y-auto border-r border-dark-200">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-6 py-5 border-b border-dark-200">
          <div className="flex items-center">
            <img src="/logoInventory.svg" alt="Logo" className="h-8 w-8" />
            <span className="ml-3 text-text-primary font-semibold text-lg tracking-tight">InvenTrack</span>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              if (item.children) {
                const isAnyChildActive = item.children.some(child => 
                  location.pathname === child.href || location.pathname.startsWith(child.href + '/')
                );
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setAlertsExpanded(!alertsExpanded)}
                      className={clsx(
                        'group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                        isAnyChildActive
                          ? 'bg-primary-600/10 text-primary-400'
                          : 'text-text-secondary hover:bg-dark-100 hover:text-text-primary'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={clsx(
                            'mr-3 flex-shrink-0 h-5 w-5',
                            isAnyChildActive ? 'text-primary-400' : 'text-text-muted group-hover:text-text-primary'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                      <ChevronDownIcon 
                        className={clsx(
                          'h-4 w-4 transition-transform',
                          alertsExpanded ? 'transform rotate-180' : ''
                        )}
                      />
                    </button>
                    
                    {alertsExpanded && (
                      <div className="mt-1 ml-6 space-y-1">
                        {item.children.map((child) => {
                          const isActive = location.pathname === child.href || 
                            location.pathname.startsWith(child.href + '/');
                          
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={clsx(
                                'group flex items-center px-3 py-2 text-sm rounded-lg transition-all',
                                isActive
                                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                  : 'text-text-secondary hover:bg-dark-100 hover:text-text-primary'
                              )}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href!}
                  className={clsx(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'text-text-secondary hover:bg-dark-100 hover:text-text-primary'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-white' : 'text-text-muted group-hover:text-text-primary'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 flex border-t border-dark-200 p-4">
          <div className="flex items-center text-sm text-text-muted">
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
