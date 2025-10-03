import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContactoById, updateContacto, deleteContacto, ServiceResponse } from '../services/Contacto.service';
import { ContactoCompleto } from '../types/ContactoCompleto';
import { ContactoBy } from '../types/ContactoBy';
import { ConfirmModal } from "../../../components/ui/ConfirmModalProps";
import { UpdateContacto } from '../types/CreateContacto';
import { getProveedores, getProveedorBy } from '../../provedores/services/proveedor.service';
import { Proveedor } from '../../provedores/types/Proveedor';

import { XMarkIcon } from '@heroicons/react/24/outline';
import {toast} from 'react-hot-toast';

const ClienteDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ContactoCompleto | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateContacto>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [empresas, setEmpresas] = useState<Proveedor[]>([]);
  const [empresaActual, setEmpresaActual] = useState<string>('');
  

  useEffect(() => {
    if (id) {
      loadCliente();
      loadEmpresas();
    }
  }, [id]);

  const loadEmpresas = async () => {
    const response = await getProveedores();
    if (response.success && response.data) {
      setEmpresas(response.data);
    }
  };

  const loadCliente = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const response: ServiceResponse<ContactoBy> = await getContactoById(id);

    if (response.success && response.data) {
      setCliente(response.data as unknown as ContactoCompleto);
      console.log(response.data);
      
      // Obtener el ID de empresa de manera consistente
      const empresaId = response.data.proveedorId?.id ;
      
      // Cargar información de la empresa actual
      if (empresaId) {
        const empresaResponse = await getProveedorBy(empresaId);
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
        fecha_Nacimiento: response.data.fecha_Nacimiento,
        correo: response.data.correo,
        direccion: response.data.direccion,
        telefono: response.data.telefono,
      });
    } else if (response.error) {
      setError(response.error.error.message);
      toast.error(response.error.error.message);
    }
    setLoading(false);
  };

  const handleChange = (field: keyof UpdateContacto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = () => {
    if (!cliente) return false;
    
    // Función para comparar fechas
    const compareDates = (date1: any, date2: any) => {
      if (!date1 && !date2) return true;
      if (!date1 || !date2) return false;
      
      let d1: Date, d2: Date;
      
      // Convertir date1 a Date
      if (date1 instanceof Date) {
        d1 = date1;
      } else if (typeof date1 === 'string') {
        d1 = new Date(date1);
      } else {
        return false;
      }
      
      // Convertir date2 a Date
      if (date2 instanceof Date) {
        d2 = date2;
      } else if (typeof date2 === 'string') {
        d2 = new Date(date2);
      } else {
        return false;
      }
      
      // Comparar solo la fecha (sin hora)
      return d1.toDateString() === d2.toDateString();
    };
    
    return (
      formData.primerNombre !== cliente.primerNombre ||
      formData.segundoNombre !== cliente.segundoNombre ||
      formData.primerApellido !== cliente.primerApellido ||
      formData.segundoApellido !== cliente.segundoApellido ||
      formData.dpi !== cliente.dpi ||
      !compareDates(formData.fecha_Nacimiento, cliente.fecha_Nacimiento) ||
      formData.correo !== cliente.correo ||
      formData.telefono !== cliente.telefono ||
      formData.direccion !== cliente.direccion 
    );
  };

  const handleSave = async () => {
    if (!cliente || !formData.id) return;
    setSaving(true);
    setError(null);

    try {
      // Preparar la fecha para enviar al backend
      let fechaNacimiento = formData.fecha_Nacimiento;
      if (fechaNacimiento instanceof Date) {
        // Si es un objeto Date, enviarlo tal como está (el backend lo manejará)
        fechaNacimiento = fechaNacimiento;
      } else if (typeof fechaNacimiento === 'string') {
        // Si es una string, convertirla a Date
        fechaNacimiento = new Date(fechaNacimiento);
      }

      const updateData: Partial<UpdateContacto> = {
        id: formData.id || "",
        primerNombre: formData.primerNombre || "",
        segundoNombre: formData.segundoNombre || "",
        primerApellido: formData.primerApellido || "",
        segundoApellido: formData.segundoApellido || "",
        dpi: formData.dpi || 0,
        fecha_Nacimiento: fechaNacimiento || new Date(),
        correo: formData.correo || "",
        telefono: formData.telefono || "",
        direccion: formData.direccion || "",
      };

      const response = await updateContacto(updateData);

      if (response.success && response.data) {
        // Actualizar el estado del cliente
        setCliente(response.data);
        
        // Obtener el ID de empresa de manera consistente
        // La respuesta puede ser ClienteBy o ClienteCompleto, manejamos ambos casos
        const empresaId = (response.data as any).empresaDto?.id || (response.data as any).proveedorId?.id;
        
        // Actualizar formData con los datos devueltos del servidor
        setFormData({
          id: response.data.id,
          primerNombre: response.data.primerNombre,
          segundoNombre: response.data.segundoNombre,
          primerApellido: response.data.primerApellido,
          segundoApellido: response.data.segundoApellido,
          dpi: response.data.dpi,
          fecha_Nacimiento: response.data.fecha_Nacimiento,
          correo: response.data.correo,
          direccion: response.data.direccion,
          telefono: response.data.telefono,
        });

        // Actualizar empresa actual
        if (empresaId) {
          const empresaResponse = await getProveedorBy(empresaId);
          if (empresaResponse.success && empresaResponse.data) {
            setEmpresaActual(empresaResponse.data.name);
          }
        } else {
          setEmpresaActual('');
        }
        
        // Si no hay empresaId pero formData.empresaId tiene un valor, 
        // significa que se seleccionó una empresa pero no se guardó correctamente
        if (!empresaId) {
          // Buscar la empresa por el ID del formData
          const empresaResponse = await getProveedores();
          if (empresaResponse.success && empresaResponse.data) {
            const empresaSeleccionada = empresaResponse.data.find(e => e.id.toString() === empresaId);
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

    const response: ServiceResponse<any> = await deleteContacto(id);
    if (response.success) {
      navigate('/home/contactos', { state: { message: 'Cliente eliminado exitosamente' } });
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
            <Link to="/home/contactos" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
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
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={(() => {
                      if (!formData.fecha_Nacimiento) return '';
                      
                      // Si ya es un objeto Date
                      if (formData.fecha_Nacimiento instanceof Date) {
                        return formData.fecha_Nacimiento.toISOString().split('T')[0];
                      }
                      
                      // Si es una string (viene del backend)
                      if (typeof formData.fecha_Nacimiento === 'string') {
                        try {
                          const date = new Date(formData.fecha_Nacimiento);
                          if (!isNaN(date.getTime())) {
                            return date.toISOString().split('T')[0];
                          }
                        } catch (error) {
                          console.error('Error parsing date:', error);
                        }
                      }
                      
                      return '';
                    })()}
                    onChange={e => {
                      const selectedDate = e.target.value ? new Date(e.target.value) : null;
                      handleChange('fecha_Nacimiento', selectedDate);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Selecciona la fecha de nacimiento"
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