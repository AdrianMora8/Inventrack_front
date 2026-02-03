import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { register, clearError } from '../authSlice';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      await dispatch(register({ email, password }));
    },
  });

  return (
    <div className="min-h-screen bg-dark-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-2xl">I</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
          Crear Cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          InvenTrack
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
            />

            <Input
              label="Contraseña"
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              {...formik.getFieldProps('confirmPassword')}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
            />

            <div className="bg-info-600 border border-info-500 text-info-100 px-4 py-3 rounded-md text-sm">
              <p className="font-medium">Nota:</p>
              <p className="mt-1">El primer usuario registrado será automáticamente Admin.</p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-text-secondary">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-medium text-primary-400 hover:text-primary-500">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
