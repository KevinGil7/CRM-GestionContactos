import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClienteById, updateCliente, deleteCliente, ServiceResponse } from '../services/Cliente.service';
import { ClienteCompleto } from '../types/ClienteCompleto';
import { ClienteBy } from '../types/ClienteBy';
import { ConfirmModal } from "../../../components/ui/ConfirmModalProps";
import { UpdateCliente } from '../types/CreateCliente';
import { getEmpresas, getEmpresaBy } from '../../empresas/services/Empresa.service';
import { Empresa } from '../../empresas/types/Empresa';

import { XMarkIcon } from '@heroicons/react/24/outline';
import {toast} from 'react-hot-toast';

const ClienteDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ClienteCompleto | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateCliente>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaActual, setEmpresaActual] = useState<string>('');
  

  useEffect(() => {
    if (id) {
      loadCliente();
      loadEmpresas();
    }
  }, [id]);

  const loadEmpresas = async () => {
    const response = await getEmpresas();
    if (response.success && response.data) {
      setEmpresas(response.data);
    }
  };

  const loadCliente = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const response: ServiceResponse<ClienteBy> = await getClienteById(id);

    if (response.success && response.data) {
      setCliente(response.data as unknown as ClienteCompleto);
      console.log(response.data);
      
      // Obtener el ID de empresa de manera consistente
      const empresaId = response.data.empresaId?.id ;
      
      // Cargar información de la empresa actual
      if (empresaId) {
        const empresaResponse = await getEmpresaBy(empresaId);
        if (empresaResponse.success && empresaResponse.data) {
          setEmpresaActual(empresaResponse.data.name);
        }
      }

      setFormData({
        id: response.data.id,
        primerNombre: response.data.primerNombre,
        segundoNombre: response.data.segundoNombre,
        primerApellido: response.data.primerApellido,
        segundoApellido: response.data.segundoApellido,
        dpi: response.data.dpi,
        nit: response.data.nit,
        correo: response.data.correo,
        direccion: response.data.direccion,
        telefono: response.data.telefono,
        // Convertir a string para consistencia con el select
        empresaId: empresaId ? empresaId.toString() : null,
      });
    } else if (response.error) {
      setError(response.error.error.message);
      toast.error(response.error.error.message);
    }
    setLoading(false);
  };

  const handleChange = (field: keyof UpdateCliente, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = () => {
    if (!cliente) return false;
    
    // Obtener el ID de empresa original de manera consistente
    const originalEmpresaId = cliente.EmpresaDto?.id 
    const originalEmpresaIdStr = originalEmpresaId ? originalEmpresaId.toString() : null;
    
    return (
      formData.primerNombre !== cliente.primerNombre ||
      formData.segundoNombre !== cliente.segundoNombre ||
      formData.primerApellido !== cliente.primerApellido ||
      formData.segundoApellido !== cliente.segundoApellido ||
      formData.dpi !== cliente.dpi ||
      formData.nit !== cliente.nit ||
      formData.correo !== cliente.correo ||
      formData.telefono !== cliente.telefono ||
      formData.direccion !== cliente.direccion ||
      formData.empresaId !== originalEmpresaIdStr
    );
  };

  const handleSave = async () => {
    if (!cliente || !formData.id) return;
    setSaving(true);
    setError(null);

    try {
      const updateData: Partial<UpdateCliente> = {
        id: formData.id || "",
        primerNombre: formData.primerNombre || "",
        segundoNombre: formData.segundoNombre || "",
        primerApellido: formData.primerApellido || "",
        segundoApellido: formData.segundoApellido || "",
        dpi: formData.dpi || 0,
        nit: formData.nit || 0,
        correo: formData.correo || "",
        telefono: formData.telefono || "",
        direccion: formData.direccion || "",
        // Convertir de string a number si existe, sino null
        empresaId: formData.empresaId  ||  null,
      };

      const response = await updateCliente(updateData);

      if (response.success && response.data) {
        // Actualizar el estado del cliente
        setCliente(response.data);
        
        // Obtener el ID de empresa de manera consistente
        // La respuesta puede ser ClienteBy o ClienteCompleto, manejamos ambos casos
        const empresaId = (response.data as any).EmpresaDto?.id || (response.data as any).empresaId?.id;
        
        // Actualizar formData con los datos devueltos del servidor
        setFormData({
          id: response.data.id,
          primerNombre: response.data.primerNombre,
          segundoNombre: response.data.segundoNombre,
          primerApellido: response.data.primerApellido,
          segundoApellido: response.data.segundoApellido,
          dpi: response.data.dpi,
          nit: response.data.nit,
          correo: response.data.correo,
          direccion: response.data.direccion,
          telefono: response.data.telefono,
          // Convertir a string para consistencia
          empresaId: empresaId ? empresaId.toString() : null,
        });

        // Actualizar empresa actual
        if (empresaId) {
          const empresaResponse = await getEmpresaBy(empresaId);
          if (empresaResponse.success && empresaResponse.data) {
            setEmpresaActual(empresaResponse.data.name);
          }
        } else {
          setEmpresaActual('');
        }
        
        // Si no hay empresaId pero formData.empresaId tiene un valor, 
        // significa que se seleccionó una empresa pero no se guardó correctamente
        if (!empresaId && formData.empresaId) {
          // Buscar la empresa por el ID del formData
          const empresaResponse = await getEmpresas();
          if (empresaResponse.success && empresaResponse.data) {
            const empresaSeleccionada = empresaResponse.data.find(e => e.id.toString() === formData.empresaId);
            if (empresaSeleccionada) {
              setEmpresaActual(empresaSeleccionada.name);
            }
          }
        }
        
        toast.success('Cliente actualizado exitosamente');
      } else if (response.error) {
        setError(response.error.error.message);
        toast.error(response.error.error.message);
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
      setError(response.error.error.message);
      setShowDeleteModal(false);
      toast.error(response.error.error.message);
    }

    setDeleting(false);
  };

  const getStatusBadge = (estado: boolean) => {
    return estado ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
        Inactivo
      </span>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  if (!cliente) return <div className="min-h-screen flex items-center justify-center">Cliente no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/home/clientes" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {cliente.primerNombre} {cliente.segundoNombre} {cliente.primerApellido} {cliente.segundoApellido}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Información del Cliente</h2>
            <p className="text-gray-600 mt-1">Edita la información personal y de contacto del cliente</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Información Personal */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Primer Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.primerNombre || ''}
                    onChange={e => handleChange('primerNombre', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa el primer nombre"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Segundo Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.segundoNombre || ''}
                    onChange={e => handleChange('segundoNombre', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa el segundo nombre (opcional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Primer Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.primerApellido || ''}
                    onChange={e => handleChange('primerApellido', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa el primer apellido"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.segundoApellido || ''}
                    onChange={e => handleChange('segundoApellido', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa el segundo apellido (opcional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    DPI <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.dpi || ''}
                    onChange={e => handleChange('dpi', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa el número de DPI"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    NIT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.nit || ''}
                    onChange={e => handleChange('nit', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa el número de NIT"
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.correo || ''}
                    onChange={e => handleChange('correo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.telefono || ''}
                    onChange={e => handleChange('telefono', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa el número de teléfono"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.direccion || ''}
                    onChange={e => handleChange('direccion', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Ingresa la dirección completa"
                  />
                </div>
              </div>
            </div>

            {/* Información de Empresa */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Información de Empresa</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Empresa Asignada
                  </label>
                  
                  {/* Mostrar empresa actual si existe */}
                  {empresaActual && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                      <h4 className="text-sm font-medium text-purple-800 mb-2">
                        Empresa Actualmente Asignada:
                      </h4>
                      <p className="text-purple-600 font-medium">{empresaActual}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={formData.empresaId || ''}
                      onChange={e => handleChange('empresaId', e.target.value || null)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                      <option value="">Selecciona una empresa</option>
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id.toString()}>
                          {empresa.name}
                        </option>
                      ))}
                    </select>

                    {formData.empresaId && (
                      <button
                        type="button"
                        onClick={() => handleChange('empresaId', null)}
                        className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition"
                        title="Quitar empresa"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {empresaActual 
                      ? 'Selecciona una empresa diferente o quita la asignación actual'
                      : 'Asigna este cliente a una empresa específica'
                    }
                  </p>
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