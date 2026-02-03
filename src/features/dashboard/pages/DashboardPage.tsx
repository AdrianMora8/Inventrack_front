import React, { useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchMovements } from '../../inventory/inventorySlice';
import { fetchAlerts } from '../../alerts/alertsSlice';
import { fetchProducts } from '../../products/productsSlice';
import { fetchCategories } from '../../categories/categoriesSlice';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { movements, loading: movementsLoading } = useAppSelector((state) => state.inventory);
  const { alerts, loading: alertsLoading } = useAppSelector((state) => state.alerts);
  const { products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchMovements());
    dispatch(fetchAlerts());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Obtener últimos 5 movimientos
  const recentMovements = movements.slice(0, 5);

  // Obtener alertas activas de stock bajo
  const lowStockAlerts = alerts
    .filter(alert => alert.status === 'ACTIVE')
    .slice(0, 5);

  // Calcular stock total
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  // Contar alertas activas
  const activeAlertsCount = alerts.filter(alert => alert.status === 'ACTIVE').length;

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'IN': return 'Entrada';
      case 'OUT': return 'Salida';
      case 'ADJUSTMENT': return 'Ajuste';
      default: return type;
    }
  };

  const getMovementTypeColor = (type: string): 'success' | 'error' | 'warning' => {
    switch (type) {
      case 'IN': return 'success';
      case 'OUT': return 'error';
      case 'ADJUSTMENT': return 'warning';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Bienvenido a InvenTrack
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-semibold text-white">{products.length}</span>
            <span className="text-xs text-text-secondary">productos</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold text-white">{totalStock}</span>
            <span className="text-xs text-text-secondary">stock</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-semibold text-white">{activeAlertsCount}</span>
            <span className="text-xs text-text-secondary">alertas</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-xs font-semibold text-white">{categories.length}</span>
            <span className="text-xs text-text-secondary">categorías</span>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Actividad Reciente */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary">
              Actividad Reciente
            </h3>
            <Link to="/inventory" className="text-sm text-primary-400 hover:text-primary-300">
              Ver todo
            </Link>
          </div>
          {movementsLoading ? (
            <div className="text-center py-8 text-text-secondary">
              <p>Cargando...</p>
            </div>
          ) : recentMovements.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <p>No hay actividad reciente</p>
              <p className="text-sm mt-2 text-text-muted">Los movimientos aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMovements.map((movement) => (
                <div
                  key={movement._id}
                  className="flex items-center justify-between p-3 bg-dark-200 rounded-lg border border-dark-100 hover:border-dark-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-text-primary">
                        {movement.product?.name || 'Producto desconocido'}
                      </p>
                      <Badge variant={getMovementTypeColor(movement.type)}>
                        {getMovementTypeLabel(movement.type)}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {format(new Date(movement.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      movement.type === 'IN' ? 'text-green-400' : 
                      movement.type === 'OUT' ? 'text-red-400' : 
                      'text-yellow-400'
                    }`}>
                      {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '±'}
                      {movement.quantity}
                    </p>
                    <p className="text-xs text-text-muted">
                      Stock: {movement.stockAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Productos con Stock Bajo */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary">
              Productos con Stock Bajo
            </h3>
            <Link to="/alerts" className="text-sm text-primary-400 hover:text-primary-300">
              Ver todo
            </Link>
          </div>
          {alertsLoading ? (
            <div className="text-center py-8 text-text-secondary">
              <p>Cargando...</p>
            </div>
          ) : lowStockAlerts.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <p>No hay productos con stock bajo</p>
              <p className="text-sm mt-2 text-text-muted">Las alertas aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="flex items-center justify-between p-3 bg-dark-200 rounded-lg border border-dark-100 hover:border-dark-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm font-medium text-text-primary">
                        {alert.product?.name || 'Producto desconocido'}
                      </p>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      SKU: {alert.product?.sku || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-400">
                      Stock: {alert.product?.stock || 0}
                    </p>
                    <p className="text-xs text-text-muted">
                      Mínimo: {alert.product?.minStock || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
