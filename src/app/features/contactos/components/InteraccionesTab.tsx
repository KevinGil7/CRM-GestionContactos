import React from 'react';

interface InteraccionesTabProps {
  interacciones: {
    tipo: string;
    asunto: string;
    notas: string;
  };
  onInteraccionChange: (field: string, value: string) => void;
}

const InteraccionesTab: React.FC<InteraccionesTabProps> = ({
  interacciones,
  onInteraccionChange
}) => {
  const tiposInteraccion = [
    { value: 'llamada', label: 'Llamada' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'reunion', label: 'Reunión' },
    { value: 'visita', label: 'Visita' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Interacción Inicial</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="Tipo" className="block text-sm font-medium text-gray-700">
            Tipo de Interacción
          </label>
          <select
            id="Tipo"
            value={interacciones.tipo}
            onChange={(e) => onInteraccionChange('tipo', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            Asunto
          </label>
          <input
            type="text"
            id="asunto"
            value={interacciones.asunto}
            onChange={(e) => onInteraccionChange('asunto', e.target.value)}
            placeholder="Asunto de la interacción"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
            Notas
          </label>
          <textarea
            id="notas"
            rows={4}
            value={interacciones.notas}
            onChange={(e) => onInteraccionChange('notas', e.target.value)}
            placeholder="Detalles adicionales sobre la interacción..."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default InteraccionesTab;
