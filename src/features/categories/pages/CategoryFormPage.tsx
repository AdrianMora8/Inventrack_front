import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createCategory, updateCategory, fetchCategoryById, clearCurrentCategory } from '../categoriesSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Loader } from '../../../components/ui/Loader';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  description: Yup.string()
    .max(200, 'La descripción no puede exceder 200 caracteres'),
});

export const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentCategory, isLoading, error } = useAppSelector((state) => state.categories);
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id));
    }
    return () => {
      dispatch(clearCurrentCategory());
    };
  }, [id, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: currentCategory?.name || '',
      description: currentCategory?.description || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isEditMode && id) {
        await dispatch(updateCategory({ id, data: values }));
      } else {
        await dispatch(createCategory(values));
      }
      navigate('/categories');
    },
  });

  if (isLoading && isEditMode && !currentCategory) {
    return <Loader text="Cargando categoría..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/categories')}
          className="p-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {isEditMode ? 'Editar Categoría' : 'Nueva Categoría'}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {isEditMode
              ? 'Modifica los datos de la categoría'
              : 'Completa los datos para crear una nueva categoría'}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      <Card>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Input
            label="Nombre *"
            type="text"
            id="name"
            placeholder="Ej: Electrónica"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Descripción opcional de la categoría"
              className="w-full px-3 py-2 bg-dark-100 text-text-primary border border-dark-200 rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 focus:border-primary-500"
              {...formik.getFieldProps('description')}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-danger-500">{formik.errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-dark-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/categories')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || !formik.isValid}
            >
              {isLoading
                ? (isEditMode ? 'Actualizando...' : 'Creando...')
                : (isEditMode ? 'Actualizar Categoría' : 'Crear Categoría')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
