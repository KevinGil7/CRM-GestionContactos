import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { resetPassword } from '@app/services/services/PasswordRecovery.service';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const code = location.state?.code;

  useEffect(() => {
    if (!email || !code) {
      toast.error('Sesión inválida. Por favor, inicia el proceso nuevamente');
      navigate('/forgot-password');
    }
  }, [email, code, navigate]);

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    if (!hasUpperCase) {
      return { isValid: false, message: 'La contraseña debe contener al menos una mayúscula' };
    }
    if (!hasLowerCase) {
      return { isValid: false, message: 'La contraseña debe contener al menos una minúscula' };
    }
    if (!hasNumber) {
      return { isValid: false, message: 'La contraseña debe contener al menos un número' };
    }
    if (!hasSpecialChar) {
      return { isValid: false, message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)' };
    }

    return { isValid: true, message: '' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // Validar fortaleza de la contraseña
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({ email, code, newPassword });
      
      if (response.success) {
        toast.success('Contraseña restablecida exitosamente');
        navigate('/', { state: { message: 'Ahora puedes iniciar sesión con tu nueva contraseña' } });
      } else {
        toast.error('Error al restablecer la contraseña');
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Nueva contraseña
            </h2>
            <p className="text-gray-300 text-sm">
              Ingresa tu nueva contraseña segura
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <TextField
                fullWidth
                label="Nueva contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                helperText={
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                    Debe contener: mayúscula, minúscula, número y carácter especial
                  </span>
                }
              />
            </div>

            <TextField
              fullWidth
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={isLoading || !newPassword || !confirmPassword}
              sx={{
                backgroundColor: '#a855f7',
                '&:hover': {
                  backgroundColor: '#9333ea',
                },
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                py: 1.5,
              }}
            >
              {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
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

export default ResetPassword;

