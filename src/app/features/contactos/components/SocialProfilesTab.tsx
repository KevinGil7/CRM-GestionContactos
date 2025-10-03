import React from 'react';

interface SocialProfilesTabProps {
  perfilSocial: {
    nameSocial: string;
    usuario: string;
    url: string;
  };
  onPerfilSocialChange: (field: string, value: string) => void;
}

const SocialProfilesTab: React.FC<SocialProfilesTabProps> = ({
  perfilSocial,
  onPerfilSocialChange
}) => {
  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Perfil Social</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="NameSocial" className="block text-sm font-medium text-gray-700">
            Plataforma Social
          </label>
          <select
            id="NameSocial"
            value={perfilSocial.nameSocial}
            onChange={(e) => onPerfilSocialChange('NameSocial', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar plataforma</option>
            {platforms.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="Usuario" className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            id="Usuario"
            value={perfilSocial.usuario}
            onChange={(e) => onPerfilSocialChange('Usuario', e.target.value)}
            placeholder="@usuario o nombre de usuario"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="Url" className="block text-sm font-medium text-gray-700">
            URL del Perfil
          </label>
          <input
            type="url"
            id="Url"
            value={perfilSocial.url}
            onChange={(e) => onPerfilSocialChange('Url', e.target.value)}
            placeholder="https://..."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialProfilesTab;
