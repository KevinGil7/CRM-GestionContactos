import React from 'react';
import { UpdateContacto } from '../types/CreateContacto';

interface PersonalInfoViewTabProps {
  formData: Partial<UpdateContacto>;
  onInputChange: (field: keyof UpdateContacto, value: any) => void;
  hasChanges: boolean;
  saving: boolean;
}

const PersonalInfoViewTab: React.FC<PersonalInfoViewTabProps> = ({ 
  formData, 
  onInputChange, 
  hasChanges, 
  saving 
}) => {
  return (
    <div className="space-y-8">
      {/* Información Personal */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primer Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.primerNombre || ''}
              onChange={e => onInputChange('primerNombre', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa el primer nombre"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Segundo Nombre
            </label>
            <input
              type="text"
              value={formData.segundoNombre || ''}
              onChange={e => onInputChange('segundoNombre', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa el segundo nombre (opcional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primer Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.primerApellido || ''}
              onChange={e => onInputChange('primerApellido', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa el primer apellido"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Segundo Apellido
            </label>
            <input
              type="text"
              value={formData.segundoApellido || ''}
              onChange={e => onInputChange('segundoApellido', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa el segundo apellido (opcional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              DPI <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.dpi || ''}
              onChange={e => onInputChange('dpi', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa el número de DPI"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={(() => {
                if (!formData.fecha_Nacimiento) return '';
                
                if (formData.fecha_Nacimiento instanceof Date) {
                  return formData.fecha_Nacimiento.toISOString().split('T')[0];
                }
                
                if (typeof formData.fecha_Nacimiento === 'string') {
                  try {
                    const date = new Date(formData.fecha_Nacimiento);
                    if (!isNaN(date.getTime())) {
                      return date.toISOString().split('T')[0];
                    }
                  } catch (error) {
                    console.error('Error parsing date:', error);
                  }
                }
                
                return '';
              })()}
              onChange={e => {
                const selectedDate = e.target.value ? new Date(e.target.value) : null;
                onInputChange('fecha_Nacimiento', selectedDate);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Selecciona la fecha de nacimiento"
            />
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.correo || ''}
              onChange={e => onInputChange('correo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.telefono || ''}
              onChange={e => onInputChange('telefono', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa el número de teléfono"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.direccion || ''}
              onChange={e => onInputChange('direccion', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Ingresa la dirección completa"
            />
          </div>
        </div>
      </div>

      {/* Indicador de cambios */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-amber-800">
              Tienes cambios sin guardar. Usa el botón "Guardar Cambios" en la parte superior para guardarlos.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoViewTab;
