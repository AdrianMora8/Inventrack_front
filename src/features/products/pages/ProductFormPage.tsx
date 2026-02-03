import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createProduct, updateProduct, fetchProductById, clearCurrentProduct } from '../productsSlice';
import { fetchCategories } from '../../categories/categoriesSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Loader } from '../../../components/ui/Loader';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  sku: Yup.string()
    .required('El SKU es requerido')
    .matches(/^[A-Z0-9-]+$/, 'El SKU solo puede contener letras mayúsculas, números y guiones')
    .min(3, 'El SKU debe tener al menos 3 caracteres')
    .max(50, 'El SKU no puede exceder 50 caracteres'),
  description: Yup.string()
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  price: Yup.number()
    .required('El precio es requerido')
    .min(0, 'El precio debe ser mayor o igual a 0')
    .test('decimal', 'El precio debe tener máximo 2 decimales', (value) => {
      if (value === undefined) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  categoryId: Yup.string()
    .required('La categoría es requerida'),
});

export const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const isEditMode = Boolean(id);

  useEffect(() => {
    dispatch(fetchCategories(false));
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: currentProduct?.name || '',
      sku: currentProduct?.sku || '',
      description: currentProduct?.description || '',
      price: currentProduct?.price || 0,
      categoryId: currentProduct?.categoryId._id || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isEditMode && id) {
        await dispatch(updateProduct({ id, data: values }));
      } else {
        await dispatch(createProduct(values));
      }
      navigate('/products');
    },
  });

  if (isLoading && isEditMode && !currentProduct) {
    return <Loader text="Cargando producto..." />;
  }

  const categoryOptions = [
    { value: '', label: 'Selecciona una categoría' },
    ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="p-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {isEditMode
              ? 'Modifica los datos del producto'
              : 'Completa los datos para crear un nuevo producto'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre *"
              type="text"
              id="name"
              placeholder="Ej: Laptop Dell XPS 15"
              {...formik.getFieldProps('name')}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
            />

            <Input
              label="SKU *"
              type="text"
              id="sku"
              placeholder="Ej: LAPTOP-DELL-001"
              {...formik.getFieldProps('sku')}
              error={formik.touched.sku && formik.errors.sku ? formik.errors.sku : undefined}
              helperText="Solo letras mayúsculas, números y guiones"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Precio *"
              type="number"
              step="0.01"
              id="price"
              placeholder="0.00"
              {...formik.getFieldProps('price')}
              error={formik.touched.price && formik.errors.price ? formik.errors.price : undefined}
            />

            <Select
              label="Categoría *"
              id="categoryId"
              options={categoryOptions}
              {...formik.getFieldProps('categoryId')}
              error={formik.touched.categoryId && formik.errors.categoryId ? formik.errors.categoryId : undefined}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Descripción detallada del producto"
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
              onClick={() => navigate('/products')}
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
                : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
