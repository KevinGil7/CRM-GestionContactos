import JwtSignInForm from '../Jwt/components/JwtSignInForm';

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Tarjeta principal con efecto glassmorphism */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo o icono de la empresa */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Bienvenido de vuelta
            </h2>
            <p className="text-gray-300 text-sm">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {/* Formulario de inicio de sesión */}
          <JwtSignInForm />
        </div>

        {/* Footer opcional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 CRM Sistema. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
