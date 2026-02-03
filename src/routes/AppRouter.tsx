import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { CategoriesListPage } from '../features/categories/pages/CategoriesListPage';
import { CategoryFormPage } from '../features/categories/pages/CategoryFormPage';
import { ProductsListPage } from '../features/products/pages/ProductsListPage';
import { ProductFormPage } from '../features/products/pages/ProductFormPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage';
import { InventoryPage } from '../features/inventory/pages/InventoryPage';
import { MovementsListPage } from '../features/inventory/pages/MovementsListPage';
import { MovementFormPage } from '../features/inventory/pages/MovementFormPage';
import { AlertsPage } from '../features/alerts/pages/AlertsPage';
import { AlertRulesPage } from '../features/alerts/pages/AlertRulesPage';
import { AlertRuleFormPage } from '../features/alerts/pages/AlertRuleFormPage';
import { EmailsPage } from '../features/emails/pages/EmailsPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/products" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductsListPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/products/new" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/products/edit/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/products/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductDetailPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/categories" element={
          <ProtectedRoute>
            <AppLayout>
              <CategoriesListPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/categories/new" element={
          <ProtectedRoute>
            <AppLayout>
              <CategoryFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/categories/edit/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <CategoryFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory" element={
          <ProtectedRoute>
            <AppLayout>
              <InventoryPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory/movements" element={
          <ProtectedRoute>
            <AppLayout>
              <MovementsListPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory/movements/new" element={
          <ProtectedRoute>
            <AppLayout>
              <MovementFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/alerts" element={
          <ProtectedRoute>
            <AppLayout>
              <AlertsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/alerts/rules" element={
          <ProtectedRoute>
            <AppLayout>
              <AlertRulesPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/alerts/rules/new" element={
          <ProtectedRoute>
            <AppLayout>
              <AlertRuleFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/alerts/rules/edit/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <AlertRuleFormPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/emails" element={
          <ProtectedRoute>
            <AppLayout>
              <EmailsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
