import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Función fake para simular login con credenciales quemadas
  const login = async (code: string, password: string) => {
    return new Promise<{ token: boolean; message?: string; id?: string; rol?: string; userName?: string; nombre?: string }>(
      (resolve) => {
        setTimeout(() => {
          if (code === "admin" && password === "12345") {
            resolve({
              token: true,
              id: "1",
              rol: "Admin",
              userName: "admin",
              nombre: "Kevin",
            });
          } else {
            resolve({ token: false, message: "Credenciales incorrectas" });
          }
        }, 1000); // simula un delay de red
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await login(code, password);
      if (data.token === true) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("id", data.id || "");
        localStorage.setItem("rol", data.rol || "");
        localStorage.setItem("userName", data.userName || "");
        localStorage.setItem("nombre", data.nombre || "");
        navigate("/home");
      } else {
        setErrorMessage(data.message || "Error en el login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-white"
            >
              Code
            </label>
            <div className="mt-2">
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center items-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer p-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign in"
              )}
            </button>
            {errorMessage && (
              <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
