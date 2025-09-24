import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCliente, ServiceResponse } from '../services/Cliente.service';
import { CreateCliente } from '../types/CreateCliente';
import { getEmpresas } from '../../empresas/services/Empresa.service';
import { Empresa } from '../../empresas/types/Empresa';
import { toast } from 'react-hot-toast';

const CrearCliente: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [perteneceEmpresa, setPerteneceEmpresa] = useState(false);
  const [formData, setFormData] = useState<CreateCliente>({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    dpi: 0,
    nit: 0,
    telefono: '',
    direccion: '',
    correo: '',
    empresaId: null,
  });

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      const response = await getEmpresas();
      if (response.success && response.data) {
        setEmpresas(response.data);
      } else if (response.error) {
        toast.error('Error al cargar empresas: ' + response.error.error.message);
      }
    } catch (err) {
      console.error('Error al cargar empresas:', err);
      toast.error('Error al cargar empresas');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'empresaId') {
      // Si se selecciona "Sin empresa", establecer null
      const empresaId = value === '' ? null : value;
      setFormData(prev => ({ ...prev, [name]: empresaId }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleToggleEmpresa = (pertenece: boolean) => {
    setPerteneceEmpresa(pertenece);
    if (!pertenece) {
      // Si no pertenece a empresa, limpiar el campo
      setFormData(prev => ({ ...prev, empresaId: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response: ServiceResponse<any> = await createCliente(formData);

      if (response.success) {
        toast.success('Cliente creado exitosamente');
        navigate('/home/clientes', { 
          state: { message: 'Cliente creado exitosamente' }
        });
      } else if (response.error) {
        setError(response.error.error.message);
        toast.error(response.error.error.message);
      }
    } catch (err) {
      console.error('Error al crear cliente:', err);
      setError('Ocurrió un error inesperado al crear el cliente');
      toast.error('Ocurrió un error inesperado al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.primerNombre.trim() !== '' &&
      formData.primerApellido.trim() !== '' &&
      formData.dpi !== 0 &&
      formData.nit !== 0 &&
      formData.telefono.trim() !== '' &&
      formData.correo.trim() !== '' &&
      formData.direccion.trim() !== ''
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <p className="mt-1 text-sm text-gray-500">Completa la información del cliente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
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

            {/* Información Personal */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="primerNombre" className="block text-sm font-medium text-gray-700">
                    Primer Nombre *
                  </label>
                  <input
                    type="text"
                    name="primerNombre"
                    id="primerNombre"
                    required
                    value={formData.primerNombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="segundoNombre" className="block text-sm font-medium text-gray-700">
                    Segundo Nombre
                  </label>
                  <input
                    type="text"
                    name="segundoNombre"
                    id="segundoNombre"
                    value={formData.segundoNombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="primerApellido" className="block text-sm font-medium text-gray-700">
                    Primer Apellido *
                  </label>
                  <input
                    type="text"
                    name="primerApellido"
                    id="primerApellido"
                    required
                    value={formData.primerApellido}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="segundoApellido" className="block text-sm font-medium text-gray-700">
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    name="segundoApellido"
                    id="segundoApellido"
                    value={formData.segundoApellido}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="dpi" className="block text-sm font-medium text-gray-700">
                    DPI *
                  </label>
                  <input
                    type="text"
                    name="dpi"
                    id="dpi"
                    required
                    value={formData.dpi}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="nit" className="block text-sm font-medium text-gray-700">
                    Nit *
                  </label>
                  <input
                    type="text"
                    name="nit"
                    id="nit"
                    required
                    value={formData.nit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    id="correo"
                    required
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    id="direccion"
                    required
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Información de Empresa */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Empresa</h3>
              
              {/* Toggle para preguntar si pertenece a empresa */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿El cliente pertenece a una empresa?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleToggleEmpresa(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      perteneceEmpresa
                        ? 'bg-blue-600 text-white shadow-md cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    Sí, pertenece a una empresa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleEmpresa(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !perteneceEmpresa
                        ? 'bg-gray-600 text-white shadow-md cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    No, es cliente independiente
                  </button>
                </div>
              </div>

              {/* Selector de empresa (solo visible si pertenece a empresa) */}
              {perteneceEmpresa && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label htmlFor="empresaId" className="block text-sm font-medium text-blue-800 mb-2">
                    Seleccionar Empresa *
                  </label>
                  <select
                    name="empresaId"
                    id="empresaId"
                    required={perteneceEmpresa}
                    value={formData.empresaId || ''}
                    onChange={handleInputChange}
                    className="block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Selecciona una empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-blue-600">
                    Selecciona la empresa a la que pertenece este cliente
                  </p>
                </div>
              )}

              {/* Mensaje cuando no pertenece a empresa */}
              {!perteneceEmpresa && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      El cliente será registrado como cliente independiente sin empresa asignada
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                to="/home/clientes"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={!isFormValid() || loading || (perteneceEmpresa && !formData.empresaId)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </div>
                ) : (
                  'Crear Cliente'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearCliente;
