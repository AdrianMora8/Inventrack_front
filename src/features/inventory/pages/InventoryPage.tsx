import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchInventory, setInventoryFilters, clearInventoryFilters } from '../inventorySlice';
import { fetchCategories } from '../../categories/categoriesSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { format } from 'date-fns';

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { inventory, inventoryFilters, isLoading, error } = useAppSelector((state) => state.inventory);
  const { categories } = useAppSelector((state) => state.categories);
  const [showFilters, setShowFilters] = useState(false);
  
  const [localFilters, setLocalFilters] = useState({
    productName: '',
    categoryId: '',
    minStock: '',
    maxStock: '',
  });

  useEffect(() => {
    dispatch(fetchInventory(inventoryFilters));
    dispatch(fetchCategories(false));
  }, [dispatch, inventoryFilters]);

  const handleApplyFilters = () => {
    const appliedFilters: any = {};
    if (localFilters.productName) appliedFilters.productName = localFilters.productName;
    if (localFilters.categoryId) appliedFilters.categoryId = localFilters.categoryId;
    if (localFilters.minStock) appliedFilters.minStock = Number(localFilters.minStock);
    if (localFilters.maxStock) appliedFilters.maxStock = Number(localFilters.maxStock);
    
    dispatch(setInventoryFilters(appliedFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({ productName: '', categoryId: '', minStock: '', maxStock: '' });
    dispatch(clearInventoryFilters());
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="danger">Sin Stock</Badge>;
    if (stock < 10) return <Badge variant="warning">Stock Bajo</Badge>;
    return <Badge variant="success">Stock OK</Badge>;
  };

  if (isLoading && inventory.length === 0 && !showFilters) {
    return <Loader text="Cargando inventario..." />;
  }

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Inventario</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Consulta el stock actual de todos los productos
          </p>
        </div>
        <div className="flex items-center space-x-6">
          {/* Stats Pills */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs font-semibold text-white">{inventory.length}</span>
              <span className="text-xs text-text-secondary">productos</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-semibold text-white">
                {inventory.reduce((sum, item) => sum + item.currentStock, 0)}
              </span>
              <span className="text-xs text-text-secondary">stock</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs font-semibold text-white">
                {inventory.filter(item => item.currentStock < 10).length}
              </span>
              <span className="text-xs text-text-secondary">bajo</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Filtros
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/inventory/movements/new')}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Movimiento
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text-primary">Filtros de Búsqueda</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-text-muted hover:text-text-secondary"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Producto"
                placeholder="Buscar por nombre..."
                value={localFilters.productName}
                onChange={(e) => setLocalFilters({ ...localFilters, productName: e.target.value })}
              />
              
              <Select
                label="Categoría"
                options={categoryOptions}
                value={localFilters.categoryId}
                onChange={(e) => setLocalFilters({ ...localFilters, categoryId: e.target.value })}
              />
              
              <Input
                label="Stock Mínimo"
                type="number"
                placeholder="0"
                value={localFilters.minStock}
                onChange={(e) => setLocalFilters({ ...localFilters, minStock: e.target.value })}
              />
              
              <Input
                label="Stock Máximo"
                type="number"
                placeholder="1000"
                value={localFilters.maxStock}
                onChange={(e) => setLocalFilters({ ...localFilters, maxStock: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-dark-200">
              <Button variant="secondary" onClick={handleClearFilters}>
                Limpiar
              </Button>
              <Button variant="primary" onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card padding="none">
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No hay productos en el inventario</p>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Producto</Table.Head>
                <Table.Head>Categoría</Table.Head>
                <Table.Head>Precio</Table.Head>
                <Table.Head>Stock Actual</Table.Head>
                <Table.Head>Estado</Table.Head>
                <Table.Head>Último Movimiento</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {inventory.map((item) => (
                <Table.Row
                  key={item.productId || item._id}
                  onClick={() => item.productId && navigate(`/products/${item.productId}`)}
                  className="cursor-pointer"
                >
                  <Table.Cell>
                    <span className="font-mono text-xs bg-dark-200 text-text-secondary px-2 py-1 rounded border border-dark-100">
                      {item.product?.sku || '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium">{item.product?.name || '-'}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="info">{item.product?.categoryId?.name || 'Sin categoría'}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold text-success-500">
                      ${item.product?.price?.toFixed(2) || '0.00'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-lg font-bold text-text-primary">
                      {item.currentStock}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {getStockBadge(item.currentStock)}
                  </Table.Cell>
                  <Table.Cell>
                    {item.lastMovement 
                      ? format(new Date(item.lastMovement), 'dd/MM/yyyy HH:mm')
                      : '-'
                    }
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
};
