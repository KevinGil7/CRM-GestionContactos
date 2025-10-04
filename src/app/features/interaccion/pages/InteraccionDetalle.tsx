import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getInteracionById, updateInteracionContacto, deleteInteracionContacto } from "../service/interacion.service";
import { interaccion } from "../types/interaccion";
import { updateInteracion } from "../types/createInteracion";
import { motion } from "framer-motion";
import { ConfirmModal } from "../../../components/ui/ConfirmModalProps";
import { Save, Trash2, CornerDownLeft, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

const InteraccionDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interaccionData, setInteraccionData] = useState<interaccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const tiposInteraccion = [
    { value: 'llamada', label: 'Llamada' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'reunion', label: 'Reunión' },
    { value: 'visita', label: 'Visita' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'otro', label: 'Otro' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const response = await getInteracionById(id);
        console.log("Respuesta del servicio:", response);
        
        if (response.success && response.data) {
          setInteraccionData(response.data);
        } else {
          console.error("Error en la respuesta:", response.error);
          toast.error("Error al cargar los datos de la interacción");
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos de la interacción");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-4 text-gray-600">Cargando detalles...</div>;
  if (!interaccionData) return <div className="p-4 text-red-600">No se encontró la interacción.</div>;

  const handleChange = (field: keyof interaccion, value: string) => {
    setInteraccionData((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleGuardar = async () => {
    if (!interaccionData) return;

    try {
      const updateData: updateInteracion = {
        tipo: interaccionData.tipo,
        asunto: interaccionData.asunto,
        notas: interaccionData.notas,
      };

      const response = await updateInteracionContacto(interaccionData.id, updateData);
      if (response.success) {
        toast.success("Cambios guardados correctamente");
        // Actualizar el estado local con los datos devueltos
        if (response.data) {
          setInteraccionData(prev => prev ? { ...prev, ...response.data } : prev);
        }
      } else {
        toast.error("Error al guardar la interacción");
      }
    } catch (error) {
      console.error("Error al guardar interacción:", error);
      toast.error("Ocurrió un error al guardar la interacción");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!interaccionData) return;

    try {
      const response = await deleteInteracionContacto(interaccionData.id);
      if (response.success) {
        setShowDeleteModal(false);
        toast.success("Interacción eliminada exitosamente");
        navigate("/home/interaccion");
      } else {
        toast.error("Error al eliminar la interacción");
      }
    } catch (error) {
      console.error("Error al eliminar interacción:", error);
      toast.error("Ocurrió un error al eliminar la interacción");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center space-x-2"
        >
          <Link to="/home/interaccion" className="flex items-center text-indigo-600 hover:underline">
            <CornerDownLeft className="w-5 h-5" />
            <span className="ml-2">Regresar</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
          className="flex space-x-3"
        >
          {/* Botón Guardar */}
          <button
            onClick={handleGuardar}
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>

          {/* Botón Eliminar */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </motion.div>
      </div>

      {/* Formulario editable */}
      <div className="bg-white shadow ring-1 ring-gray-200 rounded-lg p-6 space-y-6">
        {/* Información de la Interacción */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
            Información de la Interacción
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Tipo de Interacción</label>
              <select
                value={interaccionData.tipo}
                onChange={(e) => handleChange("tipo", e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {tiposInteraccion.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <InfoItem
              label="Asunto"
              value={interaccionData.asunto}
              onChange={(val) => handleChange("asunto", val)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notas</label>
            <textarea
              rows={6}
              value={interaccionData.notas}
              onChange={(e) => handleChange("notas", e.target.value)}
              className="w-full border rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Detalles adicionales sobre la interacción..."
            />
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">Fecha de Creación</label>
              <p className="text-sm text-gray-900">{formatDate(interaccionData.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">Última Actualización</label>
              <p className="text-sm text-gray-900">{formatDate(interaccionData.updatedAt)}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">ID del Contacto</label>
              <p className="text-sm text-gray-900 font-mono">{interaccionData.contactoId}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-500">Estado</label>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                interaccionData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {interaccionData.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="¿Estás seguro?"
          message="Esta acción eliminará la interacción permanentemente."
        />
      )}
    </div>
  );
};

// Componente reutilizable con input editable
function InfoItem({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

export default InteraccionDetalle;
