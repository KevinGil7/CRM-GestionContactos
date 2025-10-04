import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getclientesAll, deleteCliente } from '../services/cliente.service';
import { Cliente, CategoriaCliente } from '../types/cliente';
import { handleErrorToast } from '@app/utils/handleErrorToast';

export default function ClienteAll() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoriaCliente | 'all'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setLoading(true);
    const response = await getclientesAll();
    if (response.success && response.data) {
      setClientes(response.data);
      setFilteredClientes(response.data);
    } else {
      handleErrorToast('Error al cargar clientes');
    }
    setLoading(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedCategory);
  };

  const handleCategoryChange = (category: CategoriaCliente | 'all') => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category);
  };

  const applyFilters = (term: string, category: CategoriaCliente | 'all') => {
    let filtered = clientes;

    // Filtrar por término de búsqueda
    if (term.trim() !== '') {
      filtered = filtered.filter(cliente => 
        cliente.contactoId.name.toLowerCase().includes(term.toLowerCase()) ||
        cliente.contactoId.correo.toLowerCase().includes(term.toLowerCase()) ||
        cliente.nit.toString().includes(term)
      );
    }

    // Filtrar por categoría
    if (category !== 'all') {
      filtered = filtered.filter(cliente => {
        return cliente.categoriaCliente === category;
      });
      console.log('Clientes después del filtro:', filtered.length);
    }

    setFilteredClientes(filtered);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando clientes...</div>
      </div>
    );
  }
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              <p className="mt-2 text-sm text-gray-600">
                Lista de todos los clientes registrados con su información de contacto y categoría.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => navigate('/home/clientes/crear')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Cliente
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Buscador */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, correo o NIT..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtro por Categoría */}
              <div className="w-full sm:w-48">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'all') {
                        handleCategoryChange('all');
                      } else {
                        handleCategoryChange(Number(value) as CategoriaCliente);
                      }
                    }}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value={CategoriaCliente.Bronce}>Bronce</option>
                    <option value={CategoriaCliente.Plata}>Plata</option>
                    <option value={CategoriaCliente.Oro}>Oro</option>
                    <option value={CategoriaCliente.Dimante}>Diamante</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Nombre 
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Teléfono
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          NIT
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Categoría
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Estado
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredClientes.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {cliente.contactoId.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cliente.contactoId.correo}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cliente.contactoId.telefono}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cliente.nit}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              cliente.categoriaCliente === CategoriaCliente.Dimante ? 'bg-purple-100 text-purple-800' :
                              cliente.categoriaCliente === CategoriaCliente.Oro ? 'bg-yellow-100 text-yellow-800' :
                              cliente.categoriaCliente === CategoriaCliente.Plata ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {getCategoriaText(cliente.categoriaCliente)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              cliente.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                cliente.estado ? 'bg-green-400' : 'bg-red-400'
                              }`}></span>
                              {cliente.estado ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => navigate(`/home/clientes/${cliente.id}`)}
                              className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                              title="Ver detalles"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredClientes.length === 0 && (searchTerm || selectedCategory !== 'all') && (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm && selectedCategory !== 'all' 
                          ? 'Intenta con otros términos de búsqueda o cambia la categoría.'
                          : searchTerm 
                            ? 'Intenta con otros términos de búsqueda.'
                            : 'Intenta seleccionando otra categoría.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }