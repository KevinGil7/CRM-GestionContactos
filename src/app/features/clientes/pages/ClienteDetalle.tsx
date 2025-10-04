import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClienteById, updateCliente, deleteCliente, ServiceResponse } from '../services/cliente.service';
import { Cliente, CategoriaCliente } from '../types/cliente';
import { UpdateCliente } from '../types/createCliente';
import { ConfirmModal } from "../../../components/ui/ConfirmModalProps";
import { toast } from 'react-hot-toast';

const ClienteDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateCliente>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadCliente();
    }
  }, [id]);

  const loadCliente = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const response: ServiceResponse<Cliente> = await getClienteById(id);

    if (response.success && response.data) {
      setCliente(response.data);

      setFormData({
        contacto: {
          id: response.data.contactoId.id,
          primerNombre: response.data.contactoId.name,
          segundoNombre: '',
          primerApellido: '',
          segundoApellido: '',
          dpi: parseInt(response.data.contactoId.dpi),
          telefono: response.data.contactoId.telefono,
          direccion: response.data.contactoId.direccion,
          correo: response.data.contactoId.correo,
          fecha_Nacimiento: response.data.contactoId.fecha_Nacimiento
        },
        nit: response.data.nit
      });
    } else if (response.error) {
      setError('Error al cargar cliente');
      toast.error('Error al cargar cliente');
    }
    setLoading(false);
  };

  const handleChange = (field: keyof UpdateCliente, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contacto: {
        ...prev.contacto!,
        [field]: value
      }
    }));
  };

  const hasChanges = () => {
    if (!cliente) return false;
    
    return (
      formData.nit !== cliente.nit ||
      formData.contacto?.primerNombre !== cliente.contactoId.name ||
      formData.contacto?.dpi !== parseInt(cliente.contactoId.dpi) ||
      formData.contacto?.correo !== cliente.contactoId.correo ||
      formData.contacto?.telefono !== cliente.contactoId.telefono ||
      formData.contacto?.direccion !== cliente.contactoId.direccion
    );
  };

  const handleSave = async () => {
    if (!cliente || !formData.contacto?.id) return;
    setSaving(true);
    setError(null);

    try {
      const updateData: UpdateCliente = {
        contacto: {
          id: formData.contacto.id,
          primerNombre: formData.contacto.primerNombre || "",
          segundoNombre: formData.contacto.segundoNombre || "",
          primerApellido: formData.contacto.primerApellido || "",
          segundoApellido: formData.contacto.segundoApellido || "",
          dpi: formData.contacto.dpi || 0,
          fecha_Nacimiento: formData.contacto.fecha_Nacimiento || new Date(),
          correo: formData.contacto.correo || "",
          telefono: formData.contacto.telefono || "",
          direccion: formData.contacto.direccion || "",
        },
        nit: formData.nit || 0
      };

      const response = await updateCliente(id!, updateData);

      if (response.success && response.data) {
        await loadCliente();
        toast.success('Cliente actualizado exitosamente');
      } else if (response.error) {
        setError('Error al actualizar cliente');
        toast.error('Error al actualizar cliente');
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Ocurrió un error inesperado al guardar");
      toast.error("Ocurrió un error inesperado al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);

    const response: ServiceResponse<any> = await deleteCliente(id);
    if (response.success) {
      navigate('/home/clientes', { state: { message: 'Cliente eliminado exitosamente' } });
      toast.success('Cliente eliminado exitosamente');
    } else if (response.error) {
      setError('Error al eliminar cliente');
      setShowDeleteModal(false);
      toast.error('Error al eliminar cliente');
    }

    setDeleting(false);
  };

  const getCategoriaText = (categoria: CategoriaCliente) => {
    switch (categoria) {
      case CategoriaCliente.Bronce:
        return 'Bronce';
      case CategoriaCliente.Plata:
        return 'Plata';
      case CategoriaCliente.Oro:
        return 'Oro';
      case CategoriaCliente.Dimante:
        return 'Diamante';
      default:
        return 'Sin categoría';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  if (!cliente) return <div className="min-h-screen flex items-center justify-center">Cliente no encontrado</div>;

  return (
    <div className="bg-gray-50" style={{ position: 'relative' }}>
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/home/clientes" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {cliente.contactoId.name}
            </h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={!hasChanges() || saving}
              className={`inline-flex items-center px-6 py-3 border shadow-sm text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${!hasChanges() || saving
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                  : 'text-white bg-blue-600 hover:bg-blue-700 border-transparent hover:shadow-md transform hover:-translate-y-0.5'
                }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Cambios
                </>
              )}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información Personal
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.contacto?.primerNombre || ''}
                      onChange={(e) => handleContactoChange('primerNombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DPI</label>
                    <input
                      type="number"
                      value={formData.contacto?.dpi || ''}
                      onChange={(e) => handleContactoChange('dpi', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.contacto?.telefono || ''}
                      onChange={(e) => handleContactoChange('telefono', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.contacto?.correo || ''}
                      onChange={(e) => handleContactoChange('correo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <textarea
                      value={formData.contacto?.direccion || ''}
                      onChange={(e) => handleContactoChange('direccion', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={formData.contacto?.fecha_Nacimiento ? new Date(formData.contacto.fecha_Nacimiento).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleContactoChange('fecha_Nacimiento', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información del Cliente */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Información del Cliente
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                    <input
                      type="number"
                      value={formData.nit || ''}
                      onChange={(e) => handleChange('nit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        cliente.categoriaCliente === CategoriaCliente.Dimante ? 'bg-purple-100 text-purple-800' :
                        cliente.categoriaCliente === CategoriaCliente.Oro ? 'bg-yellow-100 text-yellow-800' :
                        cliente.categoriaCliente === CategoriaCliente.Plata ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {getCategoriaText(cliente.categoriaCliente)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        cliente.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          cliente.estado ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        {cliente.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Alta</label>
                    <div className="mt-1 text-gray-900">
                      {new Date(cliente.fecha_Alta).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer."
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ClienteDetalle;
