import JwtSignInForm from '../Jwt/components/JwtSignInForm';

const Login = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold leading-9 tracking-tight text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <JwtSignInForm />
      </div>
    </div>
  );
};

export default Login;
