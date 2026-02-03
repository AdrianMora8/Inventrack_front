import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-200">
      <Sidebar />
      
      <div className="md:pl-64 flex flex-col flex-1">
        <Topbar />
        
        <main className="flex-1">
          <div className="py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
