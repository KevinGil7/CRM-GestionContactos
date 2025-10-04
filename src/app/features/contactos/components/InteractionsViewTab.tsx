import React, { useState } from 'react';
import { interaccionAll } from '../../interaccion/types/interaccionAll';
import { createInteracion, updateInteracion } from '../../interaccion/types/createInteracion';
import { createInteracionContacto, updateInteracionContacto, deleteInteracionContacto } from '../../interaccion/service/interacion.service';
import { ErrorResponse } from '@app/lib/Api';
import { toast } from 'react-hot-toast';
import Modal from './Modal';

interface InteractionsViewTabProps {
  interacciones: interaccionAll[];
  contactoId: string;
  onRefresh: () => void;
}

const InteractionsViewTab: React.FC<InteractionsViewTabProps> = ({
  interacciones,
  contactoId,
  onRefresh
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<interaccionAll | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<createInteracion>({
    tipo: '',
    asunto: '',
    notas: ''
  });

  const tiposInteraccion = [
    { value: 'llamada', label: 'Llamada' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'reunion', label: 'Reunión' },
    { value: 'visita', label: 'Visita' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleOpenModal = (interaction?: interaccionAll) => {
    if (interaction) {
      setEditingInteraction(interaction);
      setFormData({
        tipo: interaction.tipo,
        asunto: interaction.asunto,
        notas: interaction.notas
      });
    } else {
      setEditingInteraction(null);
      setFormData({
        tipo: '',
        asunto: '',
        notas: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInteraction(null);
    setFormData({
      tipo: '',
      asunto: '',
      notas: ''
    });
  };

  const handleSave = async () => {
    if (!formData.tipo.trim() || !formData.asunto.trim() || !formData.notas.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (editingInteraction) {
        // Actualizar interacción existente
        const updateData: updateInteracion = {
          tipo: formData.tipo,
          asunto: formData.asunto,
          notas: formData.notas
        };
        const response = await updateInteracionContacto(editingInteraction.id, updateData);
        
        if (response.success) {
          toast.success('Interacción actualizada exitosamente');
          handleCloseModal();
          onRefresh();
        } else {
          toast.error('Error al actualizar interacción');
        }
      } else {
        // Crear nueva interacción
        const createData: createInteracion = {
          contactoId: contactoId,
          tipo: formData.tipo,
          asunto: formData.asunto,
          notas: formData.notas
        };
        const response = await createInteracionContacto(createData);
        
        if (response.success) {
          toast.success('Interacción creada exitosamente');
          handleCloseModal();
          onRefresh();
        } else {
          toast.error('Error al crear interacción');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (interactionId: string, asunto: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la interacción "${asunto}"?`)) {
      return;
    }

    try {
      const response = await deleteInteracionContacto(interactionId);
      
      if (response.success) {
        toast.success('Interacción eliminada exitosamente');
        onRefresh();
      } else {
        toast.error('Error al eliminar interacción');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInteractionIcon = (tipo: string) => {
    const iconMap = {
      llamada: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      email: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      reunion: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      visita: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      whatsapp: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
        </svg>
      ),
      sms: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      otro: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    };
    return iconMap[tipo as keyof typeof iconMap] || iconMap.otro;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Interacciones</h3>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Interacción
        </button>
      </div>

      {interacciones.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay interacciones registradas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando una interacción para este contacto.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interacciones.map((interaction) => (
            <div key={interaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getInteractionIcon(interaction.tipo)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {tiposInteraccion.find(t => t.value === interaction.tipo)?.label || interaction.tipo}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(interaction.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mt-1">{interaction.asunto}</p>
                    <p className="text-sm text-gray-600 mt-2">{interaction.notas}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenModal(interaction)}
                    className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(interaction.id, interaction.asunto)}
                    className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar interacción */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingInteraction ? 'Editar Interacción' : 'Crear Interacción'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Interacción
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              {tiposInteraccion.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto
            </label>
            <input
              type="text"
              value={formData.asunto}
              onChange={(e) => setFormData(prev => ({ ...prev, asunto: e.target.value }))}
              placeholder="Asunto de la interacción"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              rows={4}
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Detalles adicionales sobre la interacción..."
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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
              {loading ? 'Guardando...' : editingInteraction ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InteractionsViewTab;
