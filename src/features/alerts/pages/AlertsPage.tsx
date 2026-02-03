import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAlerts, resolveAlert } from '../alertsSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { format } from 'date-fns';
import type { Alert } from '../alerts.types';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activeAlerts, resolvedAlerts, isLoading, error } = useAppSelector((state) => state.alerts);
  const [showResolved, setShowResolved] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [alertToResolve, setAlertToResolve] = useState<Alert | null>(null);

  useEffect(() => {
    dispatch(fetchAlerts(undefined));
  }, [dispatch]);

  const handleResolve = async () => {
    if (alertToResolve) {
      await dispatch(resolveAlert(alertToResolve._id));
      setResolveDialogOpen(false);
      setAlertToResolve(null);
    }
  };

  const openResolveDialog = (alert: Alert) => {
    setAlertToResolve(alert);
    setResolveDialogOpen(true);
  };

  const getStockPercentage = (current: number, threshold: number) => {
    return ((current / threshold) * 100).toFixed(0);
  };

  if (isLoading && activeAlerts.length === 0 && resolvedAlerts.length === 0) {
    return <Loader text="Cargando alertas..." />;
  }

  const displayedAlerts = showResolved ? resolvedAlerts : activeAlerts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Alertas de Stock</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Productos con stock por debajo del umbral mínimo
          </p>
        </div>
        <div className="flex items-center space-x-6">
          {/* Stats Pills */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <ExclamationTriangleIcon className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">{activeAlerts.length}</span>
              <span className="text-xs text-text-secondary">activas</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <CheckCircleIcon className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">{resolvedAlerts.length}</span>
              <span className="text-xs text-text-secondary">resueltas</span>
            </div>
          </div>
          {/* Action Button */}
          <Button
            variant="secondary"
            onClick={() => dispatch(fetchAlerts(undefined))}
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setShowResolved(false)}
            className={`px-4 py-2 text-sm font-medium border ${
              !showResolved
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-dark-100 text-text-secondary border-dark-200 hover:bg-dark-200'
            } rounded-l-md`}
          >
            Activas ({activeAlerts.length})
          </button>
          <button
            type="button"
            onClick={() => setShowResolved(true)}
            className={`px-4 py-2 text-sm font-medium border ${
              showResolved
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-dark-100 text-text-secondary border-dark-200 hover:bg-dark-200'
            } rounded-r-md border-l-0`}
          >
            Resueltas ({resolvedAlerts.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        {displayedAlerts.length === 0 ? (
          <div className="text-center py-12">
            {showResolved ? (
              <>
                <CheckCircleIcon className="mx-auto h-12 w-12 text-success-500" />
                <p className="mt-2 text-text-secondary">No hay alertas resueltas</p>
              </>
            ) : (
              <>
                <CheckCircleIcon className="mx-auto h-12 w-12 text-success-500" />
                <p className="mt-2 text-text-secondary">¡Excelente! No hay alertas activas</p>
                <p className="text-sm text-text-muted mt-1">Todos los productos tienen stock suficiente</p>
              </>
            )}
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Producto</Table.Head>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Stock Actual</Table.Head>
                <Table.Head>Umbral Mínimo</Table.Head>
                <Table.Head>Nivel</Table.Head>
                <Table.Head>Fecha Creación</Table.Head>
                {showResolved && <Table.Head>Fecha Resolución</Table.Head>}
                {!showResolved && <Table.Head className="text-right">Acciones</Table.Head>}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {displayedAlerts.map((alert) => (
                <Table.Row
                  key={alert._id}
                  onClick={() => navigate(`/products/${alert.product._id}`)}
                  className="cursor-pointer"
                >
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      {alert.status === 'ACTIVE' && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">{alert.product.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-xs bg-dark-200 text-text-secondary px-2 py-1 rounded border border-dark-100">
                      {alert.product.sku}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-lg font-bold text-danger-500">
                      {alert.currentStock}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-text-secondary">{alert.threshold}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-dark-200 rounded-full h-2 border border-dark-100">
                        <div
                          className={`h-2 rounded-full ${
                            alert.currentStock === 0
                              ? 'bg-danger-600'
                              : alert.currentStock < alert.threshold * 0.5
                              ? 'bg-danger-500'
                              : 'bg-warning-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (alert.currentStock / alert.threshold) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-text-muted">
                        {getStockPercentage(alert.currentStock, alert.threshold)}%
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {format(new Date(alert.createdAt), 'dd/MM/yyyy HH:mm')}
                  </Table.Cell>
                  {showResolved && (
                    <Table.Cell>
                      {alert.resolvedAt
                        ? format(new Date(alert.resolvedAt), 'dd/MM/yyyy HH:mm')
                        : '-'}
                    </Table.Cell>
                  )}
                  {!showResolved && (
                    <Table.Cell className="text-right">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openResolveDialog(alert)}
                        >
                          Marcar como Resuelta
                        </Button>
                      </div>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>

      {/* Info Card */}
      <Card>
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-info-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-text-primary">Sobre las Alertas</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Las alertas se generan automáticamente cuando el stock de un producto cae por debajo del umbral mínimo configurado.
              Puedes marcar una alerta como resuelta una vez que hayas repuesto el stock del producto.
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Para agregar stock, ve a <span className="font-medium text-text-primary">Inventario → Nuevo Movimiento</span> y registra una entrada.
            </p>
          </div>
        </div>
      </Card>

      {/* Resolve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resolveDialogOpen}
        onClose={() => {
          setResolveDialogOpen(false);
          setAlertToResolve(null);
        }}
        onConfirm={handleResolve}
        title="Marcar Alerta como Resuelta"
        message={`¿Estás seguro de que deseas marcar la alerta del producto "${alertToResolve?.productId.name}" como resuelta? Esta acción indica que el problema de stock bajo ha sido atendido.`}
        confirmText="Marcar como Resuelta"
        cancelText="Cancelar"
        variant="primary"
        isLoading={isLoading}
      />
    </div>
  );
};
