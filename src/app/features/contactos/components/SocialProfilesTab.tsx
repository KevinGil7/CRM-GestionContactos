import React from 'react';

interface SocialProfilesTabProps {
  perfilesSociales: {
    nameSocial: string;
    usuario: string;
    url: string;
  }[];
  onPerfilSocialChange: (index: number, field: string, value: string) => void;
  onAddPerfilSocial: () => void;
  onRemovePerfilSocial: (index: number) => void;
}

const SocialProfilesTab: React.FC<SocialProfilesTabProps> = ({
  perfilesSociales,
  onPerfilSocialChange,
  onAddPerfilSocial,
  onRemovePerfilSocial
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Perfiles Sociales</h3>
        <button
          type="button"
          onClick={onAddPerfilSocial}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Perfil
        </button>
      </div>
      
      <div className="space-y-6">
        {perfilesSociales.map((perfil, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border relative">
            {perfilesSociales.length > 1 && (
              <button
                type="button"
                onClick={() => onRemovePerfilSocial(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Perfil Social {index + 1}
            </h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor={`NameSocial-${index}`} className="block text-sm font-medium text-gray-700">
                  Plataforma Social
                </label>
                <select
                  id={`NameSocial-${index}`}
                  value={perfil.nameSocial}
                  onChange={(e) => onPerfilSocialChange(index, 'nameSocial', e.target.value)}
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
                <label htmlFor={`Usuario-${index}`} className="block text-sm font-medium text-gray-700">
                  Usuario
                </label>
                <input
                  type="text"
                  id={`Usuario-${index}`}
                  value={perfil.usuario}
                  onChange={(e) => onPerfilSocialChange(index, 'usuario', e.target.value)}
                  placeholder="@usuario o nombre de usuario"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor={`Url-${index}`} className="block text-sm font-medium text-gray-700">
                  URL del Perfil
                </label>
                <input
                  type="url"
                  id={`Url-${index}`}
                  value={perfil.url}
                  onChange={(e) => onPerfilSocialChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProfilesTab;
