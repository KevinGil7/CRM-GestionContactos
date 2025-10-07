import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserById, UpdateUsers, DeleteUser, GetAllRoles, ServiceResponse } from '../service/user.service';
import { User } from '../types/user';
import { UpdateUser } from '../types/register';
import { Role } from '../types/role';
import { ConfirmModal } from "../../../components/ui/ConfirmModalProps";
import { toast } from 'react-hot-toast';

const UserDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<Partial<UpdateUser>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser();
      loadRoles();
    }
  }, [id]);

  const loadUser = async () => {
    if (!id) return;
    setLoading(true);

    const response: ServiceResponse<User> = await getUserById(id);

    if (response.success && response.data) {
      setUser(response.data);

      setFormData({
        nombre: response.data.nombre,
        apellidos: response.data.apellidos,
        email: response.data.email,
        username: response.data.username,
        rol: response.data.roles[0] || ''
      });
    } else if (response.error) {
      toast.error('Error al cargar usuario');
    }
    setLoading(false);
  };

  const loadRoles = async () => {
    const response = await GetAllRoles();
    if (response.success && response.data) {
      setRoles(response.data);
    }
  };

  const handleChange = (field: keyof UpdateUser, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = () => {
    if (!user) return false;
    
    return (
      formData.nombre !== user.nombre ||
      formData.apellidos !== user.apellidos ||
      formData.email !== user.email ||
      formData.username !== user.username ||
      formData.rol !== user.roles[0]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const updateData: UpdateUser = {
        nombre: formData.nombre || "",
        apellidos: formData.apellidos || "",
        email: formData.email || "",
        username: formData.username || "",
        rol: formData.rol || ""
      };

      const response = await UpdateUsers(id!, updateData);

      if (response.success && response.data) {
        await loadUser();
        toast.success('Usuario actualizado exitosamente');
      } else if (response.error) {
        toast.error('Error al actualizar usuario');
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      toast.error("Ocurrió un error inesperado al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);

    const response: ServiceResponse<boolean> = await DeleteUser(id);
    if (response.success) {
      navigate('/home/admin/users', { state: { message: 'Usuario eliminado exitosamente' } });
      toast.success('Usuario eliminado exitosamente');
    } else if (response.error) {
      setShowDeleteModal(false);
      toast.error('Error al eliminar usuario');
    }

    setDeleting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Usuario no encontrado</div>;

  return (
    <div className="bg-gray-50" style={{ position: 'relative' }}>
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/home/admin/users" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.nombre} {user.apellidos}
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
                      value={formData.nombre || ''}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                    <input
                      type="text"
                      value={formData.apellidos || ''}
                      onChange={(e) => handleChange('apellidos', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Usuario */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Información de Usuario
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={formData.username || ''}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select
                      value={formData.rol || ''}
                      onChange={(e) => handleChange('rol', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccione un rol...</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roles Actuales</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {user.roles.map((role, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))}
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
        message="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default UserDetalle;

