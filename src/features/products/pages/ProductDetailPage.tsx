import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchProductById, deleteProduct, clearCurrentProduct } from '../productsSlice';
import { getProductStock } from '../../inventory/inventorySlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { format } from 'date-fns';

export const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error } = useAppSelector((state) => state.products);
  const { productStock } = useAppSelector((state) => state.inventory);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(getProductStock(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (id) {
      await dispatch(deleteProduct(id));
      navigate('/products');
    }
  };

  if (isLoading && !currentProduct) {
    return <Loader text="Cargando producto..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md">
          {error}
        </div>
        <Button variant="secondary" onClick={() => navigate('/products')}>
          Volver a productos
        </Button>
      </div>
    );
  }

  if (!currentProduct) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{currentProduct.name}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              SKU: <span className="font-mono">{currentProduct.sku}</span>
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate(`/products/edit/${currentProduct._id}`)}
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-text-primary mb-4">Información General</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-text-muted">Nombre</dt>
              <dd className="mt-1 text-sm text-text-primary">{currentProduct.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-muted">SKU</dt>
              <dd className="mt-1 text-sm text-text-primary">
                <span className="font-mono bg-dark-200 text-text-secondary px-2 py-1 rounded border border-dark-100">
                  {currentProduct.sku}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-muted">Descripción</dt>
              <dd className="mt-1 text-sm text-text-secondary">
                {currentProduct.description || 'Sin descripción'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-muted">Estado</dt>
              <dd className="mt-1">
                <Badge variant={currentProduct.isActive ? 'success' : 'gray'}>
                  {currentProduct.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-text-primary mb-4">Detalles Comerciales</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-text-muted">Precio</dt>
              <dd className="mt-1 text-2xl font-bold text-success-500">
                ${currentProduct.price.toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-muted">Categoría</dt>
              <dd className="mt-1">
                <Badge variant="info">{currentProduct.category?.name || 'Sin categoría'}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-muted">Fecha de Creación</dt>
              <dd className="mt-1 text-sm text-text-secondary">
                {format(new Date(currentProduct.createdAt), 'dd/MM/yyyy HH:mm')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-muted">Última Actualización</dt>
              <dd className="mt-1 text-sm text-text-secondary">
                {format(new Date(currentProduct.updatedAt), 'dd/MM/yyyy HH:mm')}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <h3 className="text-lg font-medium text-text-primary mb-4">Información de Inventario</h3>
        {productStock ? (
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-text-muted">Stock Actual</dt>
              <dd className="mt-1">
                <span className="text-2xl font-bold text-text-primary">
                  {productStock.currentStock}
                </span>
                <span className="ml-2 text-sm text-text-muted">unidades</span>
              </dd>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div>
                <dt className="text-sm font-medium text-text-muted">Entradas</dt>
                <dd className="mt-1 text-lg font-semibold text-success-500">
                  +{productStock.movements?.in || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-muted">Salidas</dt>
                <dd className="mt-1 text-lg font-semibold text-danger-500">
                  -{productStock.movements?.out || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-muted">Ajustes</dt>
                <dd className="mt-1 text-lg font-semibold text-info-500">
                  {productStock.movements?.adjustments || 0}
                </dd>
              </div>
            </div>
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => navigate(`/inventory/movements/new?productId=${id}`)}
              >
                Registrar Movimiento
              </Button>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-text-secondary">
            Cargando información de inventario...
          </p>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${currentProduct.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};
