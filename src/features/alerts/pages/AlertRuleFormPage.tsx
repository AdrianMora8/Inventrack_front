import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createAlertRule, updateAlertRule, fetchAlertRuleById } from '../alertsSlice';
import { fetchProducts } from '../../products/productsSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Loader } from '../../../components/ui/Loader';

const validationSchema = Yup.object({
  productId: Yup.string().required('El producto es requerido'),
  minStockThreshold: Yup.number()
    .required('El umbral es requerido')
    .min(1, 'El umbral debe ser mayor a 0')
    .integer('El umbral debe ser un número entero'),
  isActive: Yup.boolean(),
});

export const AlertRuleFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditing = Boolean(id);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const { currentRule, isLoading, error } = useAppSelector((state) => state.alerts);
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    
    if (isEditing && id) {
      dispatch(fetchAlertRuleById(id)).then(() => {
        setInitialLoading(false);
      });
    }
  }, [dispatch, id, isEditing]);

  const formik = useFormik({
    initialValues: {
      productId: currentRule?.productId || '',
      minStockThreshold: currentRule?.minStockThreshold || 10,
      isActive: currentRule?.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (isEditing && id) {
        await dispatch(updateAlertRule({ id, data: values }));
      } else {
        await dispatch(createAlertRule(values));
      }
      
      if (!error) {
        navigate('/alerts/rules');
      }
    },
  });

  if (initialLoading) {
    return <Loader text="Cargando regla..." />;
  }

  // Get all active products
  const availableProducts = products.filter(product => product.isActive);

  const productOptions = [
    { value: '', label: 'Selecciona un producto' },
    ...availableProducts.map(product => ({
      value: product._id,
      label: `${product.name} (${product.sku})`
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/alerts/rules')}
            className="p-2 hover:bg-dark-200 rounded-md transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {isEditing ? 'Editar Regla de Alerta' : 'Nueva Regla de Alerta'}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {isEditing 
                ? 'Modifica la configuración de la regla de alerta' 
                : 'Configura el umbral mínimo de stock para un producto'}
            </p>
          </div>
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
          <div className="grid grid-cols-1 gap-6">
            <Select
              label="Producto"
              name="productId"
              value={formik.values.productId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.productId ? formik.errors.productId : undefined}
              disabled={isEditing}
              required
              options={productOptions}
            />

            <Input
              label="Umbral Mínimo de Stock"
              name="minStockThreshold"
              type="number"
              min="1"
              value={formik.values.minStockThreshold}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.minStockThreshold ? formik.errors.minStockThreshold : undefined}
              placeholder="Ej: 10"
              helperText="Se creará una alerta cuando el stock caiga por debajo de este valor"
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-100 rounded bg-dark-200"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-text-secondary">
                Regla activa
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-dark-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/alerts/rules')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!formik.isValid || !formik.dirty}
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Regla'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
