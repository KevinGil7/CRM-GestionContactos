import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, DeleteUser } from '../service/user.service';
import { User } from '../types/user';
import { handleErrorToast } from '@app/utils/handleErrorToast';

export default function UsersAll() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const response = await getAllUsers();
    if (response.success && response.data) {
      setUsers(response.data);
      setFilteredUsers(response.data);
    } else {
      handleErrorToast('Error al cargar usuarios');
    }
    setLoading(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, selectedRole);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    applyFilters(searchTerm, role);
  };

  const applyFilters = (term: string, role: string) => {
    let filtered = users;

    // Filtrar por término de búsqueda
    if (term.trim() !== '') {
      filtered = filtered.filter(user => 
        user.nombre.toLowerCase().includes(term.toLowerCase()) ||
        user.apellidos.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.username.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filtrar por rol
    if (role !== 'all') {
      filtered = filtered.filter(user => {
        return user.roles.includes(role);
      });
    }

    setFilteredUsers(filtered);
  };

  // Obtener todos los roles únicos de los usuarios
  const getAllUniqueRoles = () => {
    const rolesSet = new Set<string>();
    users.forEach(user => {
      user.roles.forEach(role => rolesSet.add(role));
    });
    return Array.from(rolesSet);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando usuarios...</div>
      </div>
    );
  }
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
              <p className="mt-2 text-sm text-gray-600">
                Lista de todos los usuarios registrados con su información y roles asignados.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => navigate('/home/admin/users/crear')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Usuario
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
                    placeholder="Buscar por nombre, apellido, email o username..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtro por Rol */}
              <div className="w-full sm:w-48">
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="all">Todos los roles</option>
                    {getAllUniqueRoles().map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
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
                          Apellidos
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Username
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Roles
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {user.nombre}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.apellidos}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.username}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => navigate(`/home/admin/users/${user.id}`)}
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
                  {filteredUsers.length === 0 && (searchTerm || selectedRole !== 'all') && (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm && selectedRole !== 'all' 
                          ? 'Intenta con otros términos de búsqueda o cambia el rol.'
                          : searchTerm 
                            ? 'Intenta con otros términos de búsqueda.'
                            : 'Intenta seleccionando otro rol.'
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

