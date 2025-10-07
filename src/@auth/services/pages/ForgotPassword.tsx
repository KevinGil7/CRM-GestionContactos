import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { forgotPassword } from '@app/services/services/PasswordRecovery.service';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email });
      
      if (response.success) {
        toast.success('Código de verificación enviado a tu correo');
        navigate('/verify-code', { state: { email } });
      } else {
        toast.error('Error al enviar el código de verificación');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo o icono */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-gray-300 text-sm">
              Ingresa tu correo electrónico y te enviaremos un código de verificación
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                py: 1.5,
              }}
            >
              {isLoading ? 'Enviando...' : 'Enviar código de verificación'}
            </Button>

            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

