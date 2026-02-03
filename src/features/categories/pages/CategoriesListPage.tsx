import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCategories, deleteCategory } from '../categoriesSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { format } from 'date-fns';
import type { Category } from '../categories.types';

export const CategoriesListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories, isLoading, error } = useAppSelector((state) => state.categories);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(fetchCategories(false));
  }, [dispatch]);

  const handleDelete = async () => {
    if (categoryToDelete) {
      await dispatch(deleteCategory(categoryToDelete._id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  if (isLoading && categories.length === 0) {
    return <Loader text="Cargando categorías..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Categorías</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Gestiona las categorías de productos
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/categories/new')}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Table */}
      <Card padding="none">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No hay categorías registradas</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/categories/new')}
            >
              Crear primera categoría
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nombre</Table.Head>
                <Table.Head>Descripción</Table.Head>
                <Table.Head>Estado</Table.Head>
                <Table.Head>Fecha de Creación</Table.Head>
                <Table.Head className="text-right">Acciones</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {categories.map((category) => (
                <Table.Row key={category._id}>
                  <Table.Cell>
                    <span className="font-medium">{category.name}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-text-secondary">
                      {category.description || '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={category.isActive ? 'success' : 'gray'}>
                      {category.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {format(new Date(category.createdAt), 'dd/MM/yyyy')}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/categories/edit/${category._id}`)}
                        className="p-2 text-primary-400 hover:bg-dark-200 rounded-md transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(category)}
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
          setCategoryToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};
