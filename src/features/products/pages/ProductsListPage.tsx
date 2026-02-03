import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchProducts, deleteProduct, setFilters, clearFilters } from '../productsSlice';
import { fetchCategories } from '../../categories/categoriesSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { format } from 'date-fns';
import type { Product } from '../products.types';

export const ProductsListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, filters, isLoading, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Local filter state
  const [localFilters, setLocalFilters] = useState({
    name: '',
    sku: '',
    categoryId: '',
  });

  useEffect(() => {
    dispatch(fetchProducts(filters));
    dispatch(fetchCategories(false));
  }, [dispatch, filters]);

  const handleApplyFilters = () => {
    const appliedFilters: any = {};
    if (localFilters.name) appliedFilters.name = localFilters.name;
    if (localFilters.sku) appliedFilters.sku = localFilters.sku;
    if (localFilters.categoryId) appliedFilters.categoryId = localFilters.categoryId;
    
    dispatch(setFilters(appliedFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({ name: '', sku: '', categoryId: '' });
    dispatch(clearFilters());
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete._id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  if (isLoading && products.length === 0 && !showFilters) {
    return <Loader text="Cargando productos..." />;
  }

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Productos</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Gestiona el catálogo de productos
          </p>
        </div>
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
            onClick={() => navigate('/products/new')}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </Button>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Nombre"
                placeholder="Buscar por nombre..."
                value={localFilters.name}
                onChange={(e) => setLocalFilters({ ...localFilters, name: e.target.value })}
              />
              
              <Input
                label="SKU"
                placeholder="Buscar por SKU..."
                value={localFilters.sku}
                onChange={(e) => setLocalFilters({ ...localFilters, sku: e.target.value })}
              />
              
              <Select
                label="Categoría"
                options={categoryOptions}
                value={localFilters.categoryId}
                onChange={(e) => setLocalFilters({ ...localFilters, categoryId: e.target.value })}
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
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No hay productos registrados</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/products/new')}
            >
              Crear primer producto
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Nombre</Table.Head>
                <Table.Head>Categoría</Table.Head>
                <Table.Head>Precio</Table.Head>
                <Table.Head>Estado</Table.Head>
                <Table.Head>Fecha</Table.Head>
                <Table.Head className="text-right">Acciones</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {products.map((product) => (
                <Table.Row
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="cursor-pointer"
                >
                  <Table.Cell>
                    <span className="font-mono text-xs bg-dark-200 text-text-secondary px-2 py-1 rounded border border-dark-100">
                      {product.sku}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium">{product.name}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="info">{product.category?.name || 'Sin categoría'}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold text-success-500">
                      ${product.price.toFixed(2)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={product.isActive ? 'success' : 'gray'}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {format(new Date(product.createdAt), 'dd/MM/yyyy')}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        className="p-2 text-primary-400 hover:bg-dark-200 rounded-md transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(product)}
                        className="p-2 text-danger-500 hover:bg-dark-200 rounded-md transition-colors"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};
