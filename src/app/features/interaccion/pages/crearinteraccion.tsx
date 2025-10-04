import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createInteracionContacto } from "../service/interacion.service";
import { getContactos } from "../../contactos/services/Contacto.service";
import { createInteracion } from "../types/createInteracion";
import { Contacto } from "../../contactos/types/Contacto";
import { MessageSquare, Save, ArrowLeft, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const CrearInteraccion: React.FC = () => {
  const [form, setForm] = useState<createInteracion>({
    contactoId: "",
    tipo: "",
    asunto: "",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const navigate = useNavigate();

  const tiposInteraccion = [
    { value: 'llamada', label: 'Llamada' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'reunion', label: 'Reunión' },
    { value: 'visita', label: 'Visita' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'otro', label: 'Otro' }
  ];

  useEffect(() => {
    loadContactos();
  }, []);

  const loadContactos = async () => {
    try {
      const response = await getContactos();
      if (response.success && response.data) {
        setContactos(response.data);
      } else if (response.error) {
        toast.error('Error al cargar contactos');
      }
    } catch (err) {
      console.error('Error al cargar contactos:', err);
      toast.error('Error al cargar contactos');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createInteracionContacto(form);
      
      if (response.success) {
        toast.success("Interacción creada correctamente");
        navigate("/home/interaccion");
      } else {
        toast.error("Error al crear interacción");
      }
    } catch (error) {
      console.error("Error al crear interacción:", error);
      toast.error("Ocurrió un error inesperado al crear la interacción");
    } finally {
      setLoading(false);
    }
  };

  // Obtener información del contacto seleccionado
  const contactoSeleccionado = contactos.find(c => c.id === form.contactoId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/home/interaccion"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Interacción</h1>
                <p className="mt-1 text-sm text-gray-500">Registra una nueva interacción con un contacto</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Selección de Contacto */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Seleccionar Contacto
              </h3>
              
              <div className="space-y-4">
                {/* Vista Dinámica del Contacto Seleccionado */}
                {contactoSeleccionado && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">
                      Contacto Seleccionado:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-700">Nombre:</span>
                        <p className="text-blue-600">{contactoSeleccionado.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">Teléfono:</span>
                        <p className="text-blue-600">{contactoSeleccionado.telefono}</p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">Correo:</span>
                        <p className="text-blue-600">{contactoSeleccionado.correo}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selector de Contacto */}
                <div className="space-y-3">
                  <label htmlFor="contactoId" className="block text-sm font-medium text-gray-700">
                    Contacto *
                  </label>
                  <select
                    name="contactoId"
                    id="contactoId"
                    value={form.contactoId}
                    onChange={handleChange}
                    required
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar contacto</option>
                    {contactos.map((contacto) => (
                      <option key={contacto.id} value={contacto.id}>
                        {contacto.name} - {contacto.telefono}
                      </option>
                    ))}
                  </select>
                  
                  <p className="text-sm text-gray-500">
                    Selecciona el contacto con el que se realizó la interacción.
                  </p>
                </div>
              </div>
            </div>

            {/* Información de la Interacción */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Información de la Interacción
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                    Tipo de Interacción *
                  </label>
                  <select
                    name="tipo"
                    id="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposInteraccion.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-gray-700">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    id="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Asunto de la interacción"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
                  Notas *
                </label>
                <textarea
                  name="notas"
                  id="notas"
                  rows={6}
                  value={form.notas}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detalles adicionales sobre la interacción..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                to="/home/interaccion"
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
                    Crear Interacción
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

export default CrearInteraccion;
