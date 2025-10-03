import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createContacto, ServiceResponse } from '../services/Contacto.service';
import { CreateContacto } from '../types/CreateContacto';
import { toast } from 'react-hot-toast';
import { Tabs, TabPanel } from '../components/Tabs';
import PersonalInfoTab from '../components/PersonalInfoTab';
import SocialProfilesTab from '../components/SocialProfilesTab';
import PreferencesTab from '../components/PreferencesTab';
import InteraccionesTab from '../components/InteraccionesTab';

const CrearCliente: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<CreateContacto>({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    dpi: 0,
    fecha_Nacimiento: '',
    telefono: '',
    direccion: '',
    correo: '',
    preferencia: {
      metodoPreferido: '',
      horarioDe: new Date(),
      horarioa: new Date(),
      noContactar: false
    },
    perfilSocial: {
      nameSocial: '',
      usuario: '',  
      url: ''
    },
    interacciones: {
      tipo: '',
      asunto: '',
      notas: ''
    }
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
  };

  // Handler para campos anidados de preferencias
  const handlePreferenciaChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferencia: {
        ...prev.preferencia!,
        [field]: value
      }
    }));
  };

  // Handler para campos anidados de perfiles sociales
  const handlePerfilSocialChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      perfilSocial: {
        ...prev.perfilSocial!,
        [field]: value
      }
    }));
  };

  // Handler para campos anidados de interacciones
  const handleInteraccionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      interacciones: {
        ...prev.interacciones!,
        [field]: value
      }
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar los datos para enviar, excluyendo ContactoId y campos vacíos
      const dataToSend: any = {
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        dpi: formData.dpi,
        telefono: formData.telefono,
        direccion: formData.direccion,
        correo: formData.correo,
        fecha_Nacimiento: formData.fecha_Nacimiento
      };

      // Solo agregar preferencias si tiene datos
      if (formData.preferencia && (
        formData.preferencia.metodoPreferido.trim() !== '' ||
        formData.preferencia.horarioDe ||
        formData.preferencia.horarioa ||
        formData.preferencia.noContactar
      )) {
        dataToSend.preferencia = {
          metodoPreferido: formData.preferencia.metodoPreferido,
          horarioDe: formData.preferencia.horarioDe,
          horarioa: formData.preferencia.horarioa,
          noContactar: formData.preferencia.noContactar
          // No incluir ContactoId
        };
      }

      // Solo agregar perfiles sociales si tiene datos
      if (formData.perfilSocial && (
        formData.perfilSocial.nameSocial.trim() !== '' ||
        formData.perfilSocial.usuario.trim() !== '' ||
        formData.perfilSocial.url.trim() !== ''
      )) {
        dataToSend.perfilSocial = {
          nameSocial: formData.perfilSocial.nameSocial,
          usuario: formData.perfilSocial.usuario,
          url: formData.perfilSocial.url
          // No incluir ContactoId
        };
      }

      // Solo agregar interacciones si tiene datos
      if (formData.interacciones && (
        formData.interacciones.tipo.trim() !== '' ||
        formData.interacciones.asunto.trim() !== '' ||
        formData.interacciones.notas.trim() !== ''
      )) {
        dataToSend.interacciones = {
          tipo: formData.interacciones.tipo,
          asunto: formData.interacciones.asunto,
          notas: formData.interacciones.notas
          // No incluir ContactoId
        };
      }

      const response: ServiceResponse<any> = await createContacto(dataToSend);

      if (response.success) {
        toast.success('Contacto creado exitosamente');
        navigate('/home/contactos', { 
          state: { message: 'Contacto creado exitosamente' }
        });
      } else if (response.error) {
        setError(response.error.error.message);
        toast.error(response.error.error.message);
      }
    } catch (err) {
      console.error('Error al crear contacto:', err);
      setError('Ocurrió un error inesperado al crear el contacto');
      toast.error('Ocurrió un error inesperado al crear el contacto');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.primerNombre.trim() !== '' &&
      formData.primerApellido.trim() !== '' &&
      formData.dpi !== 0 &&
      formData.fecha_Nacimiento.trim() !== '' &&
      formData.telefono.trim() !== '' &&
      formData.correo.trim() !== '' &&
      formData.direccion.trim() !== ''
    );
  };

  const getPageTitle = () => {
    if (formData.primerNombre.trim() && formData.primerApellido.trim()) {
      return `${formData.primerNombre} ${formData.primerApellido}`;
    }
    return 'Crear Nuevo Contacto';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/home/contactos"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="mt-1 text-sm text-gray-500">Completa la información del contacto</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className={`py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isFormValid() && !loading
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </div>
              ) : (
                'Crear Contacto'
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
                  <h3 className="text-sm font-medium text-red-800">Error al crear contacto</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 pt-0">
            <Tabs
              tabs={[
                {
                  id: 'personal',
                  label: 'Información Personal',
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  id: 'social',
                  label: 'Perfil Social',
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m0 0V4a1 1 0 00-1-1H8a1 1 0 00-1 1v2" />
                    </svg>
                  )
                },
                {
                  id: 'preferences',
                  label: 'Preferencias',
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                {
                  id: 'interacciones',
                  label: 'Interacción',
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )
                }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              <TabPanel isActive={activeTab === 'personal'}>
                <PersonalInfoTab
                  formData={formData}
                  onInputChange={handleInputChange}
                />
              </TabPanel>

              <TabPanel isActive={activeTab === 'social'}>
                <SocialProfilesTab
                  perfilSocial={formData.perfilSocial!}
                  onPerfilSocialChange={handlePerfilSocialChange}
                />
              </TabPanel>

              <TabPanel isActive={activeTab === 'preferences'}>
                <PreferencesTab
                  preferencia={formData.preferencia!}
                  onPreferenciaChange={handlePreferenciaChange}
                />
              </TabPanel>

              <TabPanel isActive={activeTab === 'interacciones'}>
                <InteraccionesTab
                  interacciones={formData.interacciones!}
                  onInteraccionChange={handleInteraccionChange}
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>  
      </div>

    </div>
  );
};

export default CrearCliente;
