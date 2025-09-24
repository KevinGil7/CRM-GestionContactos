import { useNavigate } from 'react-router-dom';
import { navigation } from '@app/configs/navigation';

const userRole = 'User';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

export default function Inicio() {
  const navigate = useNavigate();

  const dashboardItems = navigation.filter(
    (item) =>
      item.name !== 'Home' &&
      !item.children &&
      item.href &&
      (item.roles.includes(userRole) || !item.roles)
  );

  const nombre = localStorage.getItem("nombre") ?? "Usuario";

  return (
    <div className="p-6 relative overflow-hidden h-full">
      {/* Fondo con el logo - Posición corregida */}
      {/* <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 30%',
          backgroundSize: '33%',
          pointerEvents: 'none',
          top: '35px'
        }}
      /> */}

      {/* Contenido principal */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido, {nombre}</h2>
          <p className="text-gray-600">Selecciona una opción para continuar:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {dashboardItems.map(({ name, icon: Icon, href }) => (
            <div key={name} className="group relative">
              <button
                onClick={() => navigate(href!)}
                className="w-full h-full p-6 rounded-2xl shadow-md bg-white border border-gray-200 
                           hover:shadow-xl transition-all duration-300 cursor-pointer
                           hover:-translate-y-1 hover:border-teal-200"
              >
                {/* Efectos de fondo mejorados */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute -inset-8 bg-gradient-to-r from-teal-400 via-white to-teal-400 
                                opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-100 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Contenido con animación chilera */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative p-2 group-hover:[&>*]:animate-chilera">
                    <Icon className="w-12 h-12 text-teal-600 mb-4 transition-all duration-700 ease-in-out 
                group-hover:text-teal-500 
                group-hover:scale-110 
                group-hover:opacity-90" />
                  </div>
                  <span className="text-lg font-medium text-gray-700 relative inline-block">
                    {name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 
                                   group-hover:w-full transition-all duration-300 ease-out"></span>
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Definición de la animación chilera */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes chilera {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 0 rgba(16, 185, 129, 0));
  }
  25% {
    transform: scale(1.1) rotate(-3deg);
    filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.3));
  }
  50% {
    transform: scale(1.15) rotate(3deg);
    filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));
  }
  75% {
    transform: scale(1.1) rotate(-2deg);
    filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.3));
  }
}
        `
      }} />
    </div>
  );
}