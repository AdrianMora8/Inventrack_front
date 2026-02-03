import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  BellAlertIcon 
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAlertRules, deleteAlertRule } from '../alertsSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Loader } from '../../../components/ui/Loader';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Badge } from '../../../components/ui/Badge';
import { format } from 'date-fns';
import type { AlertRule } from '../alerts.types';

export const AlertRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { alertRules, isLoading, error } = useAppSelector((state) => state.alerts);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<AlertRule | null>(null);

  useEffect(() => {
    dispatch(fetchAlertRules());
  }, [dispatch]);

  const handleDelete = async () => {
    if (ruleToDelete) {
      await dispatch(deleteAlertRule(ruleToDelete._id));
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  const openDeleteDialog = (rule: AlertRule) => {
    setRuleToDelete(rule);
    setDeleteDialogOpen(true);
  };

  if (isLoading && alertRules.length === 0) {
    return <Loader text="Cargando reglas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Configuración de Alertas</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Define umbrales mínimos de stock para cada producto
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/alerts/rules/new')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Regla
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <div className="flex items-start space-x-3">
          <BellAlertIcon className="h-6 w-6 text-info-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-text-primary">¿Cómo funcionan las alertas?</h3>
            <p className="mt-1 text-sm text-text-secondary">
              El sistema revisa automáticamente cada 5 minutos el stock de los productos con reglas configuradas. 
              Cuando el stock cae por debajo del umbral mínimo, se crea una alerta automáticamente y se envía un correo de notificación.
            </p>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-danger-700 border border-danger-600 text-danger-100 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Table */}
      <Card padding="none">
        {alertRules.length === 0 ? (
          <div className="text-center py-12">
            <BellAlertIcon className="mx-auto h-12 w-12 text-text-muted" />
            <p className="mt-2 text-text-secondary">No hay reglas configuradas</p>
            <p className="text-sm text-text-muted mt-1">
              Crea una regla para empezar a monitorear el stock de tus productos
            </p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => navigate('/alerts/rules/new')}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear Primera Regla
            </Button>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Producto</Table.Head>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Umbral Mínimo</Table.Head>
                <Table.Head>Estado</Table.Head>
                <Table.Head>Creada</Table.Head>
                <Table.Head className="text-right">Acciones</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {alertRules.map((rule) => (
                <Table.Row key={rule._id}>
                  <Table.Cell>
                    <span className="font-medium">{rule.product.name}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-xs bg-dark-200 text-text-secondary px-2 py-1 rounded border border-dark-100">
                      {rule.product.sku}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-lg font-semibold text-warning-500">
                      {rule.minStockThreshold} unidades
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={rule.isActive ? 'success' : 'gray'}>
                      {rule.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {format(new Date(rule.createdAt), 'dd/MM/yyyy')}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/alerts/rules/edit/${rule._id}`)}
                        className="p-2 text-primary-400 hover:bg-dark-200 rounded-md transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(rule)}
                        className="p-2 text-danger-400 hover:bg-dark-200 rounded-md transition-colors"
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
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Regla"
        message={`¿Estás seguro de eliminar la regla de alerta para "${ruleToDelete?.product.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};
