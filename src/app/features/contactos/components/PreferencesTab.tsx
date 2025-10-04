import React from 'react';

interface PreferencesTabProps {
  preferencia: {
    metodoPreferido: string;
    horarioDe: string;
    horarioa: string;
    noContactar: boolean;
  };
  onPreferenciaChange: (field: string, value: any) => void;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({
  preferencia,
  onPreferenciaChange
}) => {
  const contactMethods = [
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'phone', label: 'Teléfono' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'social', label: 'Red Social' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Preferencias de Contacto</h3>

      {/* Método de contacto preferido */}
      <div>
        <label htmlFor="MetodoPreferido" className="block text-sm font-medium text-gray-700">
          Método de Contacto Preferido
        </label>
        <select
          id="MetodoPreferido"
          value={preferencia.metodoPreferido}
          onChange={(e) => onPreferenciaChange('metodoPreferido', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Seleccionar método</option>
          {contactMethods.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      </div>

      {/* Horario de contacto - Desde */}
      <div>
        <label htmlFor="HorarioDe" className="block text-sm font-medium text-gray-700">
          Horario de Contacto - Desde
        </label>
        <input
          type="time"
          id="HorarioDe"
          value={preferencia.horarioDe ? preferencia.horarioDe.substring(0, 5) : '09:00'}
          onChange={(e) => {
            const timeValue = e.target.value + ':00'; // Agregar segundos para formato TimeSpan
            onPreferenciaChange('horarioDe', timeValue);
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Horario de contacto - Hasta */}
      <div>
        <label htmlFor="Horarioa" className="block text-sm font-medium text-gray-700">
          Horario de Contacto - Hasta
        </label>
        <input
          type="time"
          id="Horarioa"
          value={preferencia.horarioa ? preferencia.horarioa.substring(0, 5) : '17:00'}
          onChange={(e) => {
            const timeValue = e.target.value + ':00'; // Agregar segundos para formato TimeSpan
            onPreferenciaChange('horarioa', timeValue);
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* No contactar */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="NoContactar"
          checked={preferencia.noContactar}
          onChange={(e) => onPreferenciaChange('noContactar', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="NoContactar" className="ml-2 block text-sm text-gray-900">
          No contactar a este cliente
        </label>
      </div>
    </div>
  );
};

export default PreferencesTab;
