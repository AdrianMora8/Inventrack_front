import React, { useEffect, useState } from 'react';
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchEmails, setFilters, clearFilters } from '../emailsSlice';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { Select } from '../../../components/ui/Select';
import { format } from 'date-fns';
import type { EmailType, EmailStatus } from '../emails.types';

export const EmailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { emails, filters, isLoading, error } = useAppSelector((state) => state.emails);
  const [showFilters, setShowFilters] = useState(false);
  
  const [localFilters, setLocalFilters] = useState({
    type: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchEmails(filters));
  }, [dispatch, filters]);

  const handleApplyFilters = () => {
    const appliedFilters: any = {};
    if (localFilters.type) appliedFilters.type = localFilters.type as EmailType;
    if (localFilters.status) appliedFilters.status = localFilters.status as EmailStatus;
    
    dispatch(setFilters(appliedFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({ type: '', status: '' });
    dispatch(clearFilters());
  };

  const getTypeLabel = (type: EmailType) => {
    const labels: Record<EmailType, string> = {
      LOW_STOCK_ALERT: 'Alerta de Stock Bajo',
      STOCK_REPLENISHED: 'Stock Reabastecido',
      SYSTEM_NOTIFICATION: 'Notificación del Sistema',
    };
    return labels[type] || type;
  };

  const getTypeBadge = (type: EmailType) => {
    const variants: Record<EmailType, 'warning' | 'success' | 'info'> = {
      LOW_STOCK_ALERT: 'warning',
      STOCK_REPLENISHED: 'success',
      SYSTEM_NOTIFICATION: 'info',
    };
    return <Badge variant={variants[type] || 'gray'}>{getTypeLabel(type)}</Badge>;
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircleIcon className="h-5 w-5 text-success-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-danger-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? 'success' : 'danger'}>
        {success ? 'Enviado' : 'Fallido'}
      </Badge>
    );
  };

  if (isLoading && emails.length === 0 && !showFilters) {
    return <Loader text="Cargando emails..." />;
  }

  const typeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'LOW_STOCK_ALERT', label: 'Alerta de Stock Bajo' },
    { value: 'STOCK_REPLENISHED', label: 'Stock Reabastecido' },
    { value: 'SYSTEM_NOTIFICATION', label: 'Notificación del Sistema' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'sent', label: 'Enviado' },
    { value: 'failed', label: 'Fallido' },
    { value: 'pending', label: 'Pendiente' },
  ];

  const sentEmails = emails.filter(e => e.status === 'sent').length;
  const failedEmails = emails.filter(e => e.status === 'failed').length;
  const pendingEmails = emails.filter(e => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Emails y Notificaciones</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Historial de emails enviados por el sistema
          </p>
        </div>
        <div className="flex items-center space-x-6">
          {/* Stats Pills */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <CheckCircleIcon className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">{sentEmails}</span>
              <span className="text-xs text-text-secondary">enviados</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <XCircleIcon className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">{failedEmails}</span>
              <span className="text-xs text-text-secondary">fallidos</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-300 rounded-full border border-dark-100">
              <ClockIcon className="h-4 w-4 text-white" />
              <span className="text-xs font-semibold text-white">{pendingEmails}</span>
              <span className="text-xs text-text-secondary">pendientes</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Filtros
            </Button>
            <Button
              variant="secondary"
              onClick={() => dispatch(fetchEmails(filters))}
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Actualizar
            </Button>
          </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Email"
                options={typeOptions}
                value={localFilters.type}
                onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value })}
              />
              
              <Select
                label="Estado"
                options={statusOptions}
                value={localFilters.status}
                onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
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
        {emails.length === 0 ? (
          <div className="text-center py-12">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-text-muted" />
            <p className="mt-2 text-text-secondary">No hay emails registrados</p>
            <p className="text-sm text-text-muted mt-1">
              Los emails se envían automáticamente cuando se generan alertas
            </p>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Tipo</Table.Head>
                <Table.Head>Destinatarios</Table.Head>
                <Table.Head>Asunto</Table.Head>
                <Table.Head>Producto</Table.Head>
                <Table.Head>Estado</Table.Head>
                <Table.Head>Fecha</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {emails.map((email) => (
                <Table.Row key={email._id}>
                  <Table.Cell>
                    {getTypeBadge(email.type)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1">
                      {email.to.split(',').slice(0, 2).map((recipient, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-dark-200 text-text-secondary border border-dark-100"
                        >
                          {recipient.trim()}
                        </span>
                      ))}
                      {email.to.split(',').length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-dark-200 text-text-secondary border border-dark-100">
                          +{email.to.split(',').length - 2} más
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-text-primary">{email.subject}</span>
                    {email.error && (
                      <p className="text-xs text-danger-500 mt-1">Error: {email.error}</p>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {email.productName ? (
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {email.productName}
                        </p>
                        {email.productSku && (
                          <p className="text-xs text-text-secondary">
                            SKU: {email.productSku}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted">-</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(email.success)}
                      {getStatusBadge(email.success)}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {email.sentAt
                      ? format(new Date(email.sentAt), 'dd/MM/yyyy HH:mm')
                      : format(new Date(email.createdAt), 'dd/MM/yyyy HH:mm')}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>

      {/* Info Card */}
      <Card>
        <div className="flex items-start space-x-3">
          <EnvelopeIcon className="h-6 w-6 text-info-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-text-primary">Sobre las Notificaciones</h3>
            <p className="mt-1 text-sm text-text-secondary">
              El sistema envía emails automáticamente en las siguientes situaciones:
            </p>
            <ul className="mt-2 text-sm text-text-secondary list-disc list-inside space-y-1">
              <li><strong className="text-text-primary">Alerta de Stock Bajo:</strong> Cuando un producto cae por debajo del umbral mínimo</li>
              <li><strong className="text-text-primary">Stock Repuesto:</strong> Cuando se resuelve una alerta de stock bajo</li>
              <li><strong className="text-text-primary">Notificación del Sistema:</strong> Eventos importantes del sistema</li>
            </ul>
            <p className="mt-2 text-sm text-text-secondary">
              Los emails se envían a todos los usuarios administradores registrados en el sistema.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
