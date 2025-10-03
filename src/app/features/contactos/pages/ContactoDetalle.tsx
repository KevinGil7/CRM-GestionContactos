import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContactoById, updateContacto, deleteContacto, ServiceResponse } from '../services/Contacto.service';
import { ContactoCompleto } from '../types/ContactoCompleto';
import { ContactoBy } from '../types/ContactoBy';
import { ConfirmModal } from "../../../components/ui/ConfirmModalProps";
import { UpdateContacto } from '../types/CreateContacto';
import { Tabs, TabPanel } from '../components/Tabs';
import PersonalInfoViewTab from '../components/PersonalInfoViewTab';
import SocialProfilesViewTab from '../components/SocialProfilesViewTab';
import PreferencesViewTab from '../components/PreferencesViewTab';
import InteractionsViewTab from '../components/InteractionsViewTab';

import { XMarkIcon } from '@heroicons/react/24/outline';
import {toast} from 'react-hot-toast';

const ClienteDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ContactoBy | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateContacto>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  

  useEffect(() => {
    if (id) {
      loadCliente();
    }
  }, [id]);

  const loadCliente = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const response: ServiceResponse<ContactoBy> = await getContactoById(id);

    if (response.success && response.data) {
      setCliente(response.data);

      setFormData({
        id: response.data.id,
        primerNombre: response.data.primerNombre,
        segundoNombre: response.data.segundoNombre,
        primerApellido: response.data.primerApellido,
        segundoApellido: response.data.segundoApellido,
        dpi: response.data.dpi,
        fecha_Nacimiento: response.data.fecha_Nacimiento,
        correo: response.data.correo,
        direccion: response.data.direccion,
        telefono: response.data.telefono,
      });
    } else if (response.error) {
      setError(response.error.error.message);
      toast.error(response.error.error.message);
    }
    setLoading(false);
  };

  const handleChange = (field: keyof UpdateContacto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = () => {
    if (!cliente) return false;
    
    // Función para comparar fechas
    const compareDates = (date1: any, date2: any) => {
      if (!date1 && !date2) return true;
      if (!date1 || !date2) return false;
      
      let d1: Date, d2: Date;
      
      // Convertir date1 a Date
      if (date1 instanceof Date) {
        d1 = date1;
      } else if (typeof date1 === 'string') {
        d1 = new Date(date1);
      } else {
        return false;
      }
      
      // Convertir date2 a Date
      if (date2 instanceof Date) {
        d2 = date2;
      } else if (typeof date2 === 'string') {
        d2 = new Date(date2);
      } else {
        return false;
      }
      
      // Comparar solo la fecha (sin hora)
      return d1.toDateString() === d2.toDateString();
    };
    
    return (
      formData.primerNombre !== cliente.primerNombre ||
      formData.segundoNombre !== cliente.segundoNombre ||
      formData.primerApellido !== cliente.primerApellido ||
      formData.segundoApellido !== cliente.segundoApellido ||
      formData.dpi !== cliente.dpi ||
      !compareDates(formData.fecha_Nacimiento, cliente.fecha_Nacimiento) ||
      formData.correo !== cliente.correo ||
      formData.telefono !== cliente.telefono ||
      formData.direccion !== cliente.direccion 
    );
  };

  const handleSave = async () => {
    if (!cliente || !formData.id) return;
    setSaving(true);
    setError(null);

    try {
      // Preparar la fecha para enviar al backend
      let fechaNacimiento = formData.fecha_Nacimiento;
      if (fechaNacimiento instanceof Date) {
        // Si es un objeto Date, enviarlo tal como está (el backend lo manejará)
        fechaNacimiento = fechaNacimiento;
      } else if (typeof fechaNacimiento === 'string') {
        // Si es una string, convertirla a Date
        fechaNacimiento = new Date(fechaNacimiento);
      }

      const updateData: Partial<UpdateContacto> = {
        id: formData.id || "",
        primerNombre: formData.primerNombre || "",
        segundoNombre: formData.segundoNombre || "",
        primerApellido: formData.primerApellido || "",
        segundoApellido: formData.segundoApellido || "",
        dpi: formData.dpi || 0,
        fecha_Nacimiento: fechaNacimiento || new Date(),
        correo: formData.correo || "",
        telefono: formData.telefono || "",
        direccion: formData.direccion || "",
      };

      const response = await updateContacto(updateData);

      if (response.success && response.data) {
        // Recargar datos completos del contacto para mantener consistencia
        await loadCliente();
        
        toast.success('Contacto actualizado exitosamente');
      } else if (response.error) {
        setError(response.error.error.message);
        toast.error(response.error.error.message);
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Ocurrió un error inesperado al guardar");
      toast.error("Ocurrió un error inesperado al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);

    const response: ServiceResponse<any> = await deleteContacto(id);
    if (response.success) {
      navigate('/home/contactos', { state: { message: 'Contacto eliminado exitosamente' } });
      toast.success('Contacto eliminado exitosamente');
    } else if (response.error) {
      setError(response.error.error.message);
      setShowDeleteModal(false);
      toast.error(response.error.error.message);
    }

    setDeleting(false);
  };

  const getStatusBadge = (estado: boolean) => {
    return estado ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
        Inactivo
      </span>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  if (!cliente) return <div className="min-h-screen flex items-center justify-center">Contacto no encontrado</div>;

  return (
    <div className="bg-gray-50" style={{ position: 'relative' }}>
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/home/contactos" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {cliente.primerNombre} {cliente.segundoNombre} {cliente.primerApellido} {cliente.segundoApellido}
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
                  label: 'Perfiles Sociales',
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
                  id: 'interactions',
                  label: 'Interacciones',
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
                <PersonalInfoViewTab
                  formData={formData}
                  onInputChange={handleChange}
                  hasChanges={hasChanges()}
                  saving={saving}
                />
              </TabPanel>

              <TabPanel isActive={activeTab === 'social'}>
                <SocialProfilesViewTab
                  perfilesSociales={cliente.perfilesSociales || []}
                  contactoId={cliente.id}
                  onRefresh={loadCliente}
                />
              </TabPanel>

              <TabPanel isActive={activeTab === 'preferences'}>
                <PreferencesViewTab
                  preferencia={cliente.preferencia || null}
                  contactoId={cliente.id}
                  onRefresh={loadCliente}
                />
              </TabPanel>

              <TabPanel isActive={activeTab === 'interactions'}>
                <InteractionsViewTab
                  interacciones={cliente.interacciones || []}
                  contactoId={cliente.id}
                  onRefresh={loadCliente}
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que quieres eliminar este contacto? Esta acción no se puede deshacer."
        confirmText={deleting ? "Eliminando..." : "Eliminar"}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ClienteDetalle;