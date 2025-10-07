import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { verifyCode } from '@app/services/services/PasswordRecovery.service';
import { toast } from 'react-hot-toast';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('No se proporcionó un correo electrónico');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await verifyCode({ email, code });
      
      if (response.success) {
        toast.success('Código verificado correctamente');
        navigate('/reset-password', { state: { email, code } });
      } else {
        toast.error('Código de verificación inválido');
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Verificar código
            </h2>
            <p className="text-gray-300 text-sm">
              Hemos enviado un código de 6 dígitos a <br />
              <span className="font-semibold text-white">{email}</span>
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              label="Código de verificación"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
              }}
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
              helperText={
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Ingresa el código de 6 dígitos
                </span>
              }
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading || code.length !== 6}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669',
                },
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                py: 1.5,
              }}
            >
              {isLoading ? 'Verificando...' : 'Verificar código'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-300">
                ¿No recibiste el código?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-white hover:underline font-semibold"
                >
                  Reenviar
                </button>
              </p>
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

export default VerifyCode;

