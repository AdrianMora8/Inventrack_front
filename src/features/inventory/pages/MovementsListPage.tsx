import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchMovements, setMovementFilters, clearMovementFilters } from '../inventorySlice';
import { fetchProducts } from '../../products/productsSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { Select } from '../../../components/ui/Select';
import { format } from 'date-fns';
import type { MovementType } from '../inventory.types';

export const MovementsListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movements, movementFilters, isLoading, error } = useAppSelector((state) => state.inventory);
  const { products } = useAppSelector((state) => state.products);
  
  const [localFilters, setLocalFilters] = useState({
    productId: '',
    type: '',
  });

  useEffect(() => {
    dispatch(fetchMovements(movementFilters));
    dispatch(fetchProducts());
  }, [dispatch, movementFilters]);

  const handleApplyFilters = () => {
    const appliedFilters: any = {};
    if (localFilters.productId) appliedFilters.productId = localFilters.productId;
    if (localFilters.type) appliedFilters.type = localFilters.type as MovementType;
    
    dispatch(setMovementFilters(appliedFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({ productId: '', type: '' });
    dispatch(clearMovementFilters());
  };

  const getMovementIcon = (type: MovementType) => {
    switch (type) {
      case 'IN':
        return <ArrowUpIcon className="h-5 w-5 text-success-500" />;
      case 'OUT':
        return <ArrowDownIcon className="h-5 w-5 text-danger-500" />;
      case 'ADJUSTMENT':
        return <AdjustmentsHorizontalIcon className="h-5 w-5 text-info-500" />;
    }
  };

  const getMovementBadge = (type: MovementType) => {
    switch (type) {
      case 'IN':
        return <Badge variant="success">Entrada</Badge>;
      case 'OUT':
        return <Badge variant="danger">Salida</Badge>;
      case 'ADJUSTMENT':
        return <Badge variant="info">Ajuste</Badge>;
    }
  };

  if (isLoading && movements.length === 0) {
    return <Loader text="Cargando movimientos..." />;
  }

  const productOptions = [
    { value: '', label: 'Todos los productos' },
    ...products.map((p) => ({ value: p._id, label: `${p.sku} - ${p.name}` })),
  ];

  const typeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'IN', label: 'Entrada' },
    { value: 'OUT', label: 'Salida' },
    { value: 'ADJUSTMENT', label: 'Ajuste' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/inventory')}
            className="p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Movimientos de Stock</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Historial de entradas, salidas y ajustes
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/inventory/movements/new')}
        >
          Nuevo Movimiento
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Filtros</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Producto"
              options={productOptions}
              value={localFilters.productId}
              onChange={(e) => setLocalFilters({ ...localFilters, productId: e.target.value })}
            />
            
            <Select
              label="Tipo de Movimiento"
              options={typeOptions}
              value={localFilters.type}
              onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value })}
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

      {/* Table */}
      <Card padding="none">
        {movements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No hay movimientos registrados</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/inventory/movements/new')}
            >
              Crear primer movimiento
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Tipo</Table.Head>
                <Table.Head>Producto</Table.Head>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Cantidad</Table.Head>
                <Table.Head>Razón</Table.Head>
                <Table.Head>Usuario</Table.Head>
                <Table.Head>Fecha</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {movements.map((movement) => (
                <Table.Row key={movement._id}>
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(movement.type)}
                      {getMovementBadge(movement.type)}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium">{movement.product?.name || '-'}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-xs bg-dark-200 text-text-secondary px-2 py-1 rounded border border-dark-100">
                      {movement.product?.sku || '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`font-bold ${
                      movement.type === 'IN' ? 'text-success-500' : 
                      movement.type === 'OUT' ? 'text-danger-500' : 
                      'text-info-500'
                    }`}>
                      {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '±'}
                      {movement.quantity}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-text-secondary text-sm">
                      {movement.reason || '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-text-primary">{movement.user?.email || '-'}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {format(new Date(movement.createdAt), 'dd/MM/yyyy HH:mm')}
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
