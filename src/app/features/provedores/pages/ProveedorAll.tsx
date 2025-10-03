import React, { useEffect, useState } from "react";
import { getProveedores } from "../services/proveedor.service";
import { Proveedor } from "../types/Proveedor";
import { useNavigate } from "react-router-dom";

const ProveedorAll: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      const response = await getProveedores();
      if (response.success && response.data) {
        setProveedores(response.data);
      }
      setLoading(false);
    };
    fetchEmpresas();
  }, []);

  if (loading) return <div>Cargando proveedores...</div>;

  return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Proveedores</h1>
            <p className="mt-1 text-sm text-gray-500">
               Proveedores registrados
            </p>
          </div>
          <button
            onClick={() => navigate("/home/proveedores/crear")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nuevo Proveedor
          </button>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats */}
      <div className="mb-8 flex justify-end">
        <div className="bg-white rounded-lg shadow px-4 py-3">
          <p className="text-sm text-gray-500">
            Total de proveedores:{" "}
            <span className="font-semibold text-gray-900">{proveedores.length}</span>
          </p>
        </div>
      </div>

      {/* Empresas List */}
      {proveedores.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 
                 0v-2c0-.656-.126-1.283-.356-1.857M7 
                 20H2v-2a3 3 0 015.356-1.857M7 
                 20v-2c0-.656.126-1.283.356-1.857m0 
                 0a5.002 5.002 0 019.288 0M15 
                 7a3 3 0 11-6 0 3 3 0 016 
                 0zm6 3a2 2 0 11-4 0 2 2 0 
                 014 0zM7 10a2 2 0 11-4 0 2 2 
                 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay proveedores
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando tu primera proveedor.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/home/proveedores/crear")}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 
                     0H6"
                />
              </svg>
              Crear Proveedor
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proveedores.map((proveedor) => (
            <div
              key={proveedor.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {proveedor.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {proveedor.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <button
                    onClick={() => navigate(`/home/proveedores/${proveedor.id}`)}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center cursor-pointer"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default ProveedorAll;