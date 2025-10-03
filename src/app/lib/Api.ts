// src/services/api.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import { apiUrl } from "../utils/UrlApi";

// Interfaz para errores del backend con el formato específico que devuelve
export interface BackendError {
  type: 'NotFound' | 'Validation' | 'Unauthorized' | 'InternalServerError' | 'BadRequest';
  message: string;
  details?: any;
  errors?: Record<string, string[]>; // Para errores de validación específicos
}

// Interfaz para respuestas de error estructuradas
export interface ErrorResponse {
  error: BackendError;
  status: number;
}

// Interfaz para el formato de error que devuelve tu backend
interface BackendErrorResponse {
  type?: string;
  title?: string;
  status: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

// Función para obtener el token del localStorage
function getTokenStorageValue(): string | null {
  return localStorage.getItem('jwt_access_token');
}

const api = axios.create({
  baseURL: apiUrl, // Ajusta según tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autorización a cada request
api.interceptors.request.use(
  (config) => {
    const token = getTokenStorageValue();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Verificar si hay un nuevo token en los headers de respuesta
    const newToken = response.headers['new-access-token'] || response.headers['New-Access-Token'];
    if (newToken) {
      localStorage.setItem('jwt_access_token', newToken);
    }
    return response;
  },
  (error: AxiosError) => {
    // Si hay respuesta del servidor
    if (error.response) {
      const { status, data } = error.response;
      
      // Intentar extraer el error del backend
      let backendError: BackendError;
      
      if (data && typeof data === 'object') {
        const errorData = data as BackendErrorResponse;
        
        // Si el backend devuelve el formato específico con "errors"
        if (errorData.errors && typeof errorData.errors === 'object') {
          // Obtener el primer mensaje de error de la lista de errores
          const firstErrorMessage = Object.values(errorData.errors)[0]?.[0] || 'Error de validación';
          
          backendError = {
            type: getErrorTypeFromStatus(status),
            message: firstErrorMessage, // Usar el mensaje específico del error
            details: errorData,
            errors: errorData.errors
          };
        }
        // Si el backend devuelve un error estructurado con "error"
        else if ('error' in data && data.error && typeof data.error === 'object') {
          const errorData = data.error as any;
          backendError = {
            type: errorData.type || getErrorTypeFromStatus(status),
            message: errorData.message || 'Error del servidor',
            details: data
          };
        } 
        // Si el backend devuelve un mensaje simple
        else if ('message' in data) {
          backendError = {
            type: getErrorTypeFromStatus(status),
            message: data.message as string,
            details: data
          };
        }
        // Si el backend devuelve un título (como en tu caso)
        else if ('title' in data) {
          backendError = {
            type: getErrorTypeFromStatus(status),
            message: errorData.title || 'Error en la solicitud',
            details: data
          };
        }
        // Error genérico
        else {
          backendError = {
            type: getErrorTypeFromStatus(status),
            message: 'Error en la solicitud',
            details: data
          };
        }
      } else {
        // Error sin datos estructurados
        backendError = {
          type: getErrorTypeFromStatus(status),
          message: error.message || 'Error desconocido',
          details: null
        };
      }
      
      // Si es un error 401 (no autorizado), limpiar el token y redirigir al login
      if (status === 401) {
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_username');
        localStorage.removeItem('user_roles');
        
        // Opcional: redirigir al login si estás en el navegador
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      
      // Crear error estructurado
      const structuredError: ErrorResponse = {
        error: backendError,
        status: status || 500
      };
      
      // Rechazar con el error estructurado
      return Promise.reject(structuredError);
    }
    
    // Error de red (sin respuesta del servidor)
    const networkError: ErrorResponse = {
      error: {
        type: 'InternalServerError',
        message: 'Error de conexión. Verifica tu conexión a internet.',
        details: error.message
      },
      status: 0
    };
    
    return Promise.reject(networkError);
  }
);

// Función helper para mapear códigos de estado a tipos de error
function getErrorTypeFromStatus(status: number): BackendError['type'] {
  switch (status) {
    case 400:
      return 'BadRequest';
    case 401:
      return 'Unauthorized';
    case 404:
      return 'NotFound';
    case 422:
      return 'Validation';
    case 500:
    default:
      return 'InternalServerError';
  }
}

export default api;

