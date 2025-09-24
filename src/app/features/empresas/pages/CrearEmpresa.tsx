import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEmpresa } from "../services/Empresa.service";
import { getClientes } from "../../clientes/services/Cliente.service";
import { CreateEmpresa } from "../types/CreateEmpresa";
import { ClienteEmpresa } from "../../clientes/types/ClienteEmpresa";
import { User, Building2, Save, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const CrearEmpresa: React.FC = () => {
  const [form, setForm] = useState<CreateEmpresa>({
    name: "",
    email: "",
    phone: "",
    contactoPrincipal: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<ClienteEmpresa[]>([]);
  const [clientePrincipalId, setClientePrincipalId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await getClientes();
      if (response.success && response.data) {
        setClientes(response.data);
      } else if (response.error) {
        toast.error('Error al cargar clientes: ' + response.error.error.message);
      }
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      toast.error('Error al cargar clientes');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClientePrincipalChange = (clienteId: string | null) => {
    setClientePrincipalId(clienteId);
    setForm(prev => ({ ...prev, contactoPrincipal: clienteId || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const empresaToSend = { ...form };
      if (!empresaToSend.contactoPrincipal) delete empresaToSend.contactoPrincipal;
      
      const response = await createEmpresa(empresaToSend);
      
      if (response.success) {
        toast.success("Empresa creada correctamente");
        navigate("/home/empresas");
      } else {
        toast.error("Error al crear empresa: " + response.error?.error);
      }
    } catch (error) {
      console.error("Error al crear empresa:", error);
      toast.error("Ocurrió un error inesperado al crear la empresa");
    } finally {
      setLoading(false);
    }
  };

  // Obtener información del cliente seleccionado
  const clienteSeleccionado = clientes.find(c => c.id === clientePrincipalId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/home/empresas"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Empresa</h1>
                <p className="mt-1 text-sm text-gray-500">Completa la información de la empresa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Información de la Empresa */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
                Información de la Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingresa el nombre de la empresa"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ejemplo@empresa.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingresa el teléfono"
                  />
                </div>
              </div>
            </div>

            {/* Cliente Principal */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Cliente Principal (Opcional)
              </h3>
              
              <div className="space-y-4">
                {/* Vista Dinámica del Cliente Seleccionado */}
                {clienteSeleccionado && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-3">
                      Cliente Seleccionado:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-700">Nombre:</span>
                        <p className="text-green-600">{clienteSeleccionado.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Teléfono:</span>
                        <p className="text-green-600">{clienteSeleccionado.telefono}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Correo:</span>
                        <p className="text-green-600">{clienteSeleccionado.correo}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selector de Cliente Principal */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Seleccionar Cliente Principal
                  </label>
                  <div className="flex items-center space-x-3">
                    <select
                      value={clientePrincipalId || ''}
                      onChange={(e) => handleClientePrincipalChange(e.target.value || null)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    El cliente principal será el contacto principal de esta empresa. Puedes asignarlo ahora o más tarde.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                to="/home/empresas"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Empresa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearEmpresa;