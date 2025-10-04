import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCliente, ServiceResponse } from '../services/cliente.service';
import { getContactos } from '@app/features/contactos/services/Contacto.service';
import { CreateCliente } from '../types/createCliente';
import { Contacto } from '@app/features/contactos/types/Contacto';
import { toast } from 'react-hot-toast';

const CrearCliente: React.FC = () => {
  const navigate = useNavigate();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'existing' | 'new'>('existing');
  const [selectedContactoId, setSelectedContactoId] = useState<string>('');
  const [formData, setFormData] = useState<CreateCliente>({
    nit: 0,
    contacto: {
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      dpi: 0,
      telefono: '',
      direccion: '',
      correo: '',
      fecha_Nacimiento: ''
    }
  });

  useEffect(() => {
    loadContactos();
  }, []);

  const loadContactos = async () => {
    setLoading(true);
    const response = await getContactos();
    if (response.success && response.data) {
      setContactos(response.data);
    } else {
      setError('Error al cargar contactos');
      toast.error('Error al cargar contactos');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let clienteData: CreateCliente;

      if (selectedOption === 'existing') {
        if (!selectedContactoId) {
          setError('Por favor selecciona un contacto');
          toast.error('Por favor selecciona un contacto');
          setSaving(false);
          return;
        }
        clienteData = {
          contactoId: selectedContactoId,
          nit: formData.nit
        };
      } else {
        if (!formData.contacto?.primerNombre || !formData.contacto?.correo) {
          setError('Por favor completa todos los campos obligatorios');
          toast.error('Por favor completa todos los campos obligatorios');
          setSaving(false);
          return;
        }
        clienteData = {
          contacto: formData.contacto,
          nit: formData.nit
        };
      }

      const response: ServiceResponse<any> = await createCliente(clienteData);
      if (response.success) {
        toast.success('Cliente creado exitosamente');
        navigate('/home/clientes', { 
          state: { message: 'Cliente creado exitosamente' }
        });
      } else if (response.error) {
        setError('Error al crear cliente');
        toast.error('Error al crear cliente');
      }
    } catch (err) {
      console.error('Error al crear cliente:', err);
      setError('Ocurrió un error inesperado al crear el cliente');
      toast.error('Ocurrió un error inesperado al crear el cliente');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando contactos...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/home/clientes"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Cliente</h1>
                <p className="mt-1 text-sm text-gray-500">Selecciona un contacto existente o crea uno nuevo</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className={`py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                !saving
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </div>
              ) : (
                'Crear Cliente'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 m-6 mb-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error al crear cliente</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Opción de selección */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Contacto</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="existing-contact"
                      type="radio"
                      name="contact-option"
                      value="existing"
                      checked={selectedOption === 'existing'}
                      onChange={(e) => setSelectedOption(e.target.value as 'existing' | 'new')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="existing-contact" className="ml-3 block text-sm font-medium text-gray-900">
                      Usar contacto existente
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="new-contact"
                      type="radio"
                      name="contact-option"
                      value="new"
                      checked={selectedOption === 'new'}
                      onChange={(e) => setSelectedOption(e.target.value as 'existing' | 'new')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="new-contact" className="ml-3 block text-sm font-medium text-gray-900">
                      Crear nuevo contacto
                    </label>
                  </div>
                </div>
              </div>

              {/* Selector de contactos existentes */}
              {selectedOption === 'existing' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Contacto
                  </label>
                  <select
                    value={selectedContactoId}
                    onChange={(e) => setSelectedContactoId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={selectedOption === 'existing'}
                  >
                    <option value="">Selecciona un contacto...</option>
                    {contactos.map((contacto) => (
                      <option key={contacto.id} value={contacto.id}>
                        {contacto.name} - {contacto.correo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Formulario para nuevo contacto */}
              {selectedOption === 'new' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Información del Contacto</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.contacto?.primerNombre || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contacto: { ...formData.contacto!, primerNombre: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={selectedOption === 'new'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DPI *
                      </label>
                      <input
                        type="number"
                        value={formData.contacto?.dpi || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contacto: { ...formData.contacto!, dpi: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={selectedOption === 'new'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.contacto?.telefono || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contacto: { ...formData.contacto!, telefono: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={selectedOption === 'new'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.contacto?.correo || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contacto: { ...formData.contacto!, correo: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={selectedOption === 'new'}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección *
                      </label>
                      <textarea
                        value={formData.contacto?.direccion || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          contacto: { ...formData.contacto!, direccion: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={selectedOption === 'new'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Información del cliente */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIT *
                  </label>
                  <input
                    type="number"
                    value={formData.nit || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      nit: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default CrearCliente;
