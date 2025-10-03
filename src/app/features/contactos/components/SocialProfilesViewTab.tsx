import React, { useState } from 'react';
import { PerfilSocialAll } from '../../perfilessocial/types/perfilsocialAll';
import { CreatePerfilSocial, UpdatePerfilSocial } from '../../perfilessocial/types/createPerfilSocial';
import { PostPerfilContacto, UpdatePerfilContacto, DeletePerfilContacto } from '../../perfilessocial/service/perfilSocial.service';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaTelegram, 
  FaTiktok, 
  FaYoutube,
  FaGlobe
} from 'react-icons/fa';

interface SocialProfilesViewTabProps {
  perfilesSociales: PerfilSocialAll[];
  contactoId: string;
  onRefresh: () => void;
}

const SocialProfilesViewTab: React.FC<SocialProfilesViewTabProps> = ({
  perfilesSociales,
  contactoId,
  onRefresh
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<PerfilSocialAll | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePerfilSocial>({
    nameSocial: '',
    usuario: '',
    url: ''
  });

  const platforms = [
    { value: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
    { value: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
    { value: 'twitter', label: 'Twitter', icon: FaTwitter, color: 'text-blue-400' },
    { value: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-700' },
    { value: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500' },
    { value: 'telegram', label: 'Telegram', icon: FaTelegram, color: 'text-blue-500' },
    { value: 'tiktok', label: 'TikTok', icon: FaTiktok, color: 'text-black' },
    { value: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
    { value: 'other', label: 'Otro', icon: FaGlobe, color: 'text-gray-500' }
  ];

  const getPlatformIcon = (platformValue: string) => {
    const platform = platforms.find(p => p.value === platformValue);
    if (platform) {
      const IconComponent = platform.icon;
      return <IconComponent className={`w-5 h-5 ${platform.color}`} />;
    }
    return <FaGlobe className="w-5 h-5 text-gray-500" />;
  };

  const handleOpenModal = (profile?: PerfilSocialAll) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData({
        nameSocial: profile.nameSocial,
        usuario: profile.usuario,
        url: profile.url
      });
    } else {
      setEditingProfile(null);
      setFormData({
        nameSocial: '',
        usuario: '',
        url: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProfile(null);
    setFormData({
      nameSocial: '',
      usuario: '',
      url: ''
    });
  };

  const handleSave = async () => {
    if (!formData.nameSocial.trim() || !formData.usuario.trim() || !formData.url.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (editingProfile) {
        // Actualizar perfil existente
        const updateData: UpdatePerfilSocial = {
          nameSocial: formData.nameSocial,
          usuario: formData.usuario,
          url: formData.url
        };
        const response = await UpdatePerfilContacto(editingProfile.id, updateData);
        
        if (response.success) {
          toast.success('Perfil social actualizado exitosamente');
          handleCloseModal();
          onRefresh();
        } else {
          toast.error(response.error?.error.message || 'Error al actualizar perfil social');
        }
      } else {
        // Crear nuevo perfil
        const createData: CreatePerfilSocial = {
          contactoId: contactoId,
          nameSocial: formData.nameSocial,
          usuario: formData.usuario,
          url: formData.url
        };
        const response = await PostPerfilContacto(createData);
        
        if (response.success) {
          toast.success('Perfil social creado exitosamente');
          handleCloseModal();
          onRefresh();
        } else {
          toast.error(response.error?.error.message || 'Error al crear perfil social');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (profileId: string, profileName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el perfil de ${profileName}?`)) {
      return;
    }

    try {
      const response = await DeletePerfilContacto(profileId);
      
      if (response.success) {
        toast.success('Perfil social eliminado exitosamente');
        onRefresh();
      } else {
        toast.error(response.error?.error.message || 'Error al eliminar perfil social');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Perfiles Sociales</h3>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Perfil
        </button>
      </div>

      {perfilesSociales.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay perfiles sociales</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando un perfil social para este contacto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {perfilesSociales.map((profile) => (
            <div key={profile.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(profile.nameSocial)}
                    <h4 className="text-sm font-medium text-gray-900">
                      {platforms.find(p => p.value === profile.nameSocial)?.label || profile.nameSocial}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">@{profile.usuario}</p>
                  <a 
                    href={profile.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 truncate block mt-1"
                  >
                    {profile.url}
                  </a>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOpenModal(profile)}
                    className="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id, profile.nameSocial)}
                    className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar perfil */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProfile ? 'Editar Perfil Social' : 'Crear Perfil Social'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataforma Social
            </label>
            <select
              value={formData.nameSocial}
              onChange={(e) => setFormData(prev => ({ ...prev, nameSocial: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar plataforma</option>
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={formData.usuario}
              onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
              placeholder="@usuario o nombre de usuario"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL del Perfil
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : editingProfile ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SocialProfilesViewTab;
