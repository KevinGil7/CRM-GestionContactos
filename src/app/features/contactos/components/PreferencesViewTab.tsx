import React, { useState } from 'react';
import { preferenciaAll } from '../../preferencia/types/preferenciaAll';
import { createPreferencia, updatePreferencia } from '../../preferencia/types/createPreferencia';
import { PostPerfilContacto, UpdatePerfilContacto, DeletePerfilContacto } from '../../preferencia/service/preferencia.service';
import { toast } from 'react-hot-toast';
import Modal from './Modal';

interface PreferencesViewTabProps {
  preferencia: preferenciaAll | null;
  contactoId: string;
  onRefresh: () => void;
}

const PreferencesViewTab: React.FC<PreferencesViewTabProps> = ({
  preferencia,
  contactoId,
  onRefresh
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<createPreferencia>({
    metodoPreferido: '',
    horarioDe: '09:00:00',
    horarioa: '17:00:00',
    noContactar: false
  });

  const contactMethods = [
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'phone', label: 'Teléfono' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'social', label: 'Red Social' }
  ];

  const handleOpenModal = () => {
    if (preferencia) {
      setFormData({
        metodoPreferido: preferencia.metodoPreferido,
        horarioDe: preferencia.horarioDe,
        horarioa: preferencia.horarioa,
        noContactar: preferencia.noContactar
      });
    } else {
      setFormData({
        metodoPreferido: '',
        horarioDe: '09:00:00',
        horarioa: '17:00:00',
        noContactar: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!formData.metodoPreferido.trim()) {
      toast.error('El método preferido es obligatorio');
      return;
    }

    setLoading(true);
    try {
      if (preferencia) {
        // Actualizar preferencias existentes
        const updateData: updatePreferencia = {
          metodoPreferido: formData.metodoPreferido,
          horarioDe: formData.horarioDe,
          horarioa: formData.horarioa,
          noContactar: formData.noContactar 
        };
        const response = await UpdatePerfilContacto(preferencia.id, updateData);
        
        if (response.success) {
          toast.success('Preferencias actualizadas exitosamente');
          handleCloseModal();
          onRefresh();
        } else {
          toast.error(response.error?.error.message || 'Error al actualizar preferencias');
        }
      } else {
        // Crear nuevas preferencias
        const createData: createPreferencia = {
          contactoId: contactoId,
          metodoPreferido: formData.metodoPreferido,
          horarioDe: formData.horarioDe,
          horarioa: formData.horarioa,
          noContactar: formData.noContactar
        };
        const response = await PostPerfilContacto(createData);
        
        if (response.success) {
          toast.success('Preferencias creadas exitosamente');
          handleCloseModal();
          onRefresh();
        } else {
          toast.error(response.error?.error.message || 'Error al crear preferencias');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!preferencia) return;
    
    if (!confirm('¿Estás seguro de que quieres eliminar las preferencias de contacto?')) {
      return;
    }

    try {
      const response = await DeletePerfilContacto(preferencia.id);
      
      if (response.success) {
        toast.success('Preferencias eliminadas exitosamente');
        onRefresh();
      } else {
        toast.error(response.error?.error.message || 'Error al eliminar preferencias');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (error) {
      return '--:--';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Preferencias de Contacto</h3>
        <div className="space-x-2">
          {preferencia && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          )}
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {preferencia ? 'Editar' : 'Crear'} Preferencia
          </button>
        </div>
      </div>

      {preferencia ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Método de Contacto Preferido</h4>
              <p className="text-lg font-semibold text-gray-900">
                {contactMethods.find(m => m.value === preferencia.metodoPreferido)?.label || preferencia.metodoPreferido}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Horario de Contacto</h4>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(preferencia.horarioDe)} - {formatTime(preferencia.horarioa)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Contactar</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                preferencia.noContactar 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {preferencia.noContactar ? 'No Contactar' : 'Contacto Permitido'}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Última Actualización</h4>
              <p className="text-sm text-gray-900">{formatDate(preferencia.updateAt)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay preferencias configuradas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Configura las preferencias de contacto para este cliente.
          </p>
        </div>
      )}

      {/* Modal para crear/editar preferencias */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={preferencia ? 'Editar Preferencia' : 'Crear Preferencia'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Contacto Preferido
            </label>
            <select
              value={formData.metodoPreferido}
              onChange={(e) => setFormData(prev => ({ ...prev, metodoPreferido: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar método</option>
              {contactMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario de Contacto - Desde
            </label>
            <input
              type="time"
              value={formData.horarioDe.substring(0, 5)}
              onChange={(e) => {
                const timeValue = e.target.value + ':00'; // Agregar segundos para formato TimeSpan
                setFormData(prev => ({ ...prev, horarioDe: timeValue }));
              }}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario de Contacto - Hasta
            </label>
            <input
              type="time"
              value={formData.horarioa.substring(0, 5)}
              onChange={(e) => {
                const timeValue = e.target.value + ':00'; // Agregar segundos para formato TimeSpan
                setFormData(prev => ({ ...prev, horarioa: timeValue }));
              }}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="NoContactar"
              checked={formData.noContactar}
              onChange={(e) => setFormData(prev => ({ ...prev, noContactar: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="NoContactar" className="ml-2 block text-sm text-gray-900">
              No contactar a este cliente
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : preferencia ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PreferencesViewTab;
