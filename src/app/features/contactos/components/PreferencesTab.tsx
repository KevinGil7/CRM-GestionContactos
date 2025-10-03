import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PreferencesTabProps {
  preferencia: {
    metodoPreferido: string;
    horarioDe: Date;
    horarioa: Date;
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
        <DatePicker
          selected={preferencia.horarioDe}
          onChange={(date: Date | null) => {
            if (date) {
              onPreferenciaChange('horarioDe', date);
            }
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Hora"
          dateFormat="HH:mm"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholderText="Seleccionar hora"
        />
      </div>

      {/* Horario de contacto - Hasta */}
      <div>
        <label htmlFor="Horarioa" className="block text-sm font-medium text-gray-700">
          Horario de Contacto - Hasta
        </label>
        <DatePicker
          selected={preferencia.horarioa}
          onChange={(date: Date | null) => {
            if (date) {
              onPreferenciaChange('horarioa', date);
            }
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Hora"
          dateFormat="HH:mm"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholderText="Seleccionar hora"
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
