import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProveedorBy, updateProveedor, deleteProveedor } from "../services/proveedor.service";
import { getContactos } from "../../contactos/services/Contacto.service";
import { ProveedorBy } from "../types/ProveedorBy";
import { Contacto } from "../../contactos/types/Contacto";
import { motion } from "framer-motion";
import { ConfirmModal } from "../../../components/ui/ConfirmModalProps";
import { Save, Trash2, CornerDownLeft, User, Building2 } from "lucide-react";
import { CreateProveedor } from "../types/CreateProveedor";
import { toast } from "react-hot-toast";

const ProveedorDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [empresa, setEmpresa] = useState<ProveedorBy | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientes, setClientes] = useState<Contacto[]>([]);
  const [clientePrincipalId, setClientePrincipalId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        // Cargar empresa y clientes en paralelo
        const [empresaResponse, clientesResponse] = await Promise.all([
          getProveedorBy(id),
          getContactos()
        ]);

        if (empresaResponse.success && empresaResponse.data) {
          setEmpresa(empresaResponse.data);
          setClientePrincipalId(empresaResponse.data.contactoPrincipalDto?.id || null);
        }

        if (clientesResponse.success && clientesResponse.data) {
          setClientes(clientesResponse.data);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos del proveedor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-4 text-gray-600">Cargando detalles...</div>;
  if (!empresa) return <div className="p-4 text-red-600">No se encontró el proveedor.</div>;

  const handleChange = (field: keyof ProveedorBy, value: string) => {
    setEmpresa((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleClientePrincipalChange = (clienteId: string | null) => {
    setClientePrincipalId(clienteId);
  };

  const handleGuardar = async () => {
    if (!empresa) return;

    try {
      const proveedorUpdate: CreateProveedor = {
        name: empresa.name,
        email: empresa.email,
        phone: empresa.phone,
        contactoPrincipal: clientePrincipalId || undefined,
      };

      const response = await updateProveedor(empresa.id, proveedorUpdate);
      if (response.success) {
        toast.success("Cambios guardados correctamente ");
        // Actualizar el estado local con los datos devueltos
        if (response.data) {
          setEmpresa(prev => prev ? { ...prev, ...response.data } : prev);
        }
      } else {
        toast.error("Error al guardar: " + response.error?.error.message);
      }
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      toast.error("Ocurrió un error al guardar el proveedor");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!empresa) return;

    try {
      const response = await deleteProveedor(empresa.id);
      if (response.success) {
        setShowDeleteModal(false);
        toast.success("Proveedor eliminada exitosamente");
        navigate("/home/proveedores");
      } else {
        toast.error("Error al eliminar: " + response.error?.error.message);
      }
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      toast.error("Ocurrió un error al eliminar el proveedor");
    }
  };

  // Obtener información del cliente principal actual
  const clientePrincipalActual = empresa.contactoPrincipalDto;
  const clienteSeleccionado = clientes.find(c => c.id === clientePrincipalId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center space-x-2"
        >
          <Link to="/home/proveedores" className="flex items-center text-indigo-600 hover:underline">
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
        {/* Información de la Empresa */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
            Información del Proveedor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Nombre"
              value={empresa.name}
              onChange={(val) => handleChange("name", val)}
            />
            <InfoItem
              label="Email"
              value={empresa.email}
              onChange={(val) => handleChange("email", val)}
            />
            <InfoItem
              label="Teléfono"
              value={empresa.phone}
              onChange={(val) => handleChange("phone", val)}
            />
          </div>
        </div>

        {/* Cliente Principal */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-green-600" />
            Cliente Principal
          </h3>
          
          {/* Vista Dinámica del Cliente Principal */}
          <div className="space-y-4">
            {/* Información del Cliente Principal (Actual o Seleccionado) */}
            {(clientePrincipalActual || clienteSeleccionado) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-3">
                  {clienteSeleccionado ? 'Cliente Seleccionado:' : 'Cliente Principal Actual:'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Nombre:</span>
                    <p className="text-green-600">
                      {clienteSeleccionado?.name || clientePrincipalActual?.name}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Teléfono:</span>
                    <p className="text-green-600">
                      {clienteSeleccionado?.telefono || clientePrincipalActual?.telefono}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Correo:</span>
                    <p className="text-green-600">
                      {clienteSeleccionado?.correo || clientePrincipalActual?.correo}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selector de Cliente Principal */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {clientePrincipalActual ? 'Cambiar Cliente Principal' : 'Asignar Cliente Principal'}
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={clientePrincipalId || ''}
                  onChange={(e) => handleClientePrincipalChange(e.target.value || null)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sin cliente principal</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.name} - {cliente.telefono}
                    </option>
                  ))}
                </select>
                
                {clientePrincipalId && (
                  <button
                    type="button"
                    onClick={() => handleClientePrincipalChange(null)}
                    className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                    title="Quitar cliente principal"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <p className="text-sm text-gray-500">
                El cliente principal será el contacto principal de este proveedor
              </p>
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
          message="Esta acción eliminará el proveedor permanentemente."
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

export default ProveedorDetalle;
