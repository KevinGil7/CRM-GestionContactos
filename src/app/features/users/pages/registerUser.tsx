import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, GetAllRoles, ServiceResponse } from '../service/user.service';
import { RegisterUser as RegisterUserType } from '../types/register';
import { Role } from '../types/role';
import { toast } from 'react-hot-toast';

const RegisterUser: React.FC   = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<RegisterUserType>({
    nombre: '',
    apellidos: '',
    email: '',
    username: '',
    password: '',
    rol: ''
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    const response = await GetAllRoles();
    if (response.success && response.data) {
      setRoles(response.data);
    } else {
      toast.error('Error al cargar roles');
    }
    setLoading(false);
  };

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    if (!hasUpperCase) {
      return { isValid: false, message: 'La contraseña debe contener al menos una mayúscula' };
    }
    if (!hasLowerCase) {
      return { isValid: false, message: 'La contraseña debe contener al menos una minúscula' };
    }
    if (!hasNumber) {
      return { isValid: false, message: 'La contraseña debe contener al menos un número' };
    }
    if (!hasSpecialChar) {
      return { isValid: false, message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)' };
    }

    return { isValid: true, message: '' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validación básica
      if (!formData.nombre || !formData.apellidos || !formData.email || !formData.username || !formData.password || !formData.rol) {
        toast.error('Por favor completa todos los campos');
        setSaving(false);
        return;
      }

      // Validación de contraseña
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        setSaving(false);
        return;
      }

      const response: ServiceResponse<any> = await registerUser(formData);
      if (response.success) {
        toast.success('Usuario creado exitosamente');
        navigate('/home/admin/users', { 
          state: { message: 'Usuario creado exitosamente' }
        });
      } else if (response.error) {
        toast.error('Error al crear usuario');
      }
    } catch (err) {
      console.error('Error al crear usuario:', err);
      toast.error('Ocurrió un error inesperado al crear el usuario');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando roles...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/home/admin/users"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
                <p className="mt-1 text-sm text-gray-500">Completa todos los campos para registrar un nuevo usuario</p>
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
                'Crear Usuario'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Personal */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Información de Cuenta */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Información de Cuenta
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Mayúscula, minúscula, número y carácter especial"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (!@#$%...)
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol *
                    </label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecciona un rol...</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name} ({role.userCount} usuarios)
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Selecciona el rol que tendrá este usuario en el sistema
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default RegisterUser;

