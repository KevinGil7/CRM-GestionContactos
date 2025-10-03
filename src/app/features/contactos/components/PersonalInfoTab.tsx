import React from 'react';
import { CreateContacto } from '../types/CreateContacto';

interface PersonalInfoTabProps {
  formData: CreateContacto;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="primerNombre" className="block text-sm font-medium text-gray-700">
            Primer Nombre *
          </label>
          <input
            type="text"
            name="primerNombre"
            id="primerNombre"
            required
            value={formData.primerNombre}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="segundoNombre" className="block text-sm font-medium text-gray-700">
            Segundo Nombre
          </label>
          <input
            type="text"
            name="segundoNombre"
            id="segundoNombre"
            value={formData.segundoNombre}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="primerApellido" className="block text-sm font-medium text-gray-700">
            Primer Apellido *
          </label>
          <input
            type="text"
            name="primerApellido"
            id="primerApellido"
            required
            value={formData.primerApellido}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="segundoApellido" className="block text-sm font-medium text-gray-700">
            Segundo Apellido
          </label>
          <input
            type="text"
            name="segundoApellido"
            id="segundoApellido"
            value={formData.segundoApellido}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dpi" className="block text-sm font-medium text-gray-700">
            DPI *
          </label>
          <input
            type="text"
            name="dpi"
            id="dpi"
            required
            value={formData.dpi}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="fecha_Nacimiento" className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            name="fecha_Nacimiento"
            id="fecha_Nacimiento"
            required
            value={formData.fecha_Nacimiento}
            onChange={onInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              id="telefono"
              required
              value={formData.telefono}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="correo"
              id="correo"
              required
              value={formData.correo}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
              Dirección *
            </label>
            <input
              type="text"
              name="direccion"
              id="direccion"
              required
              value={formData.direccion}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
