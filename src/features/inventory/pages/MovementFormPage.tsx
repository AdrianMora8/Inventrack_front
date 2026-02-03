import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createMovement } from '../inventorySlice';
import { fetchProducts } from '../../products/productsSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

const validationSchema = Yup.object({
  productId: Yup.string()
    .required('El producto es requerido'),
  type: Yup.string()
    .oneOf(['IN', 'OUT', 'ADJUSTMENT'], 'Tipo de movimiento inválido')
    .required('El tipo de movimiento es requerido'),
  quantity: Yup.number()
    .required('La cantidad es requerida')
    .positive('La cantidad debe ser mayor a 0')
    .integer('La cantidad debe ser un número entero'),
  reason: Yup.string()
    .max(200, 'La razón no puede exceder 200 caracteres'),
});

export const MovementFormPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.inventory);
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      productId: '',
      type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT',
      quantity: 1,
      reason: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(createMovement(values));
      navigate('/inventory/movements');
    },
  });

  const productOptions = [
    { value: '', label: 'Selecciona un producto' },
    ...products.map((p) => ({ value: p._id, label: `${p.sku} - ${p.name}` })),
  ];

  const typeOptions = [
    { value: 'IN', label: 'Entrada (Agregar stock)' },
    { value: 'OUT', label: 'Salida (Reducir stock)' },
    { value: 'ADJUSTMENT', label: 'Ajuste (Corrección)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/inventory/movements')}
          className="p-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Nuevo Movimiento</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Registra una entrada, salida o ajuste de stock
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger-500/10 border border-danger-500/30 text-danger-500 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Entrada</p>
              <p className="text-xs text-text-secondary mt-1">Incrementa el stock del producto</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-2">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Salida</p>
              <p className="text-xs text-text-secondary mt-1">Reduce el stock del producto</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Ajuste</p>
              <p className="text-xs text-text-secondary mt-1">Corrección manual del stock</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Producto *"
              id="productId"
              options={productOptions}
              {...formik.getFieldProps('productId')}
              error={formik.touched.productId && formik.errors.productId ? formik.errors.productId : undefined}
            />

            <Select
              label="Tipo de Movimiento *"
              id="type"
              options={typeOptions}
              {...formik.getFieldProps('type')}
              error={formik.touched.type && formik.errors.type ? formik.errors.type : undefined}
            />
          </div>

          <Input
            label="Cantidad *"
            type="number"
            id="quantity"
            placeholder="1"
            {...formik.getFieldProps('quantity')}
            error={formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : undefined}
            helperText="Cantidad de unidades a mover"
          />

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-text-primary mb-1">
              Razón / Motivo
            </label>
            <textarea
              id="reason"
              rows={3}
              placeholder="Ej: Compra de mercadería, Venta, Corrección de inventario, etc."
              className="w-full px-3 py-2 bg-dark-100 text-text-primary border border-dark-200 rounded-md shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 focus:border-primary-500"
              {...formik.getFieldProps('reason')}
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="mt-1 text-sm text-danger-500">{formik.errors.reason}</p>
            )}
            <p className="mt-1 text-sm text-text-muted">
              Opcional: Describe el motivo de este movimiento
            </p>
          </div>

          <div className="bg-primary-500/10 border border-primary-500/30 rounded-md p-4">
            <p className="text-sm text-text-primary">
              <strong>Nota:</strong> Este movimiento se registrará inmediatamente y actualizará el stock del producto.
              Asegúrate de verificar los datos antes de confirmar.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-dark-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/inventory/movements')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? 'Registrando...' : 'Registrar Movimiento'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
