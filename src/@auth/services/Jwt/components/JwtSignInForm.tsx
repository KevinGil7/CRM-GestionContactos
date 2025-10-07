import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import useAuth from '@fuse/core/FuseAuthProvider/useAuth';
import { JwtSignInPayload } from '../JwtAuthProvider';
import { handleErrorToast } from '@app/utils/handleErrorToast';
import { authSignIn } from '@auth/authApi';
import { Link } from 'react-router-dom';

const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.')
});

type FormType = JwtSignInPayload & {
	remember?: boolean;
};

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function JwtSignInForm() {
	const [isLoading, setIsLoading] = useState(false);
	
	// Get the auth context to trigger re-authentication
	const { authState } = useAuth();

	const { control, formState, handleSubmit, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	async function onSubmit(formData: FormType) {
		const { email, password } = formData;

		setIsLoading(true);

		try {
			const response = await authSignIn({
				email,
				password
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			
			if (!data || !data.token) {
				throw new Error('Invalid response data');
			}

			// Extract roles from JWT token
			let userRoles = ['Administrator']; // Default role
			try {
				const tokenParts = data.token.split('.');
				if (tokenParts.length === 3) {
					const payload = tokenParts[1];
					const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
					const decodedPayload = atob(paddedPayload);
					const payloadObj = JSON.parse(decodedPayload);
					userRoles = payloadObj['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ['Administrator'];
					console.log('JwtSignInForm - Extracted roles from token:', userRoles);
				}
			} catch (error) {
				console.error('Error decoding JWT token:', error);
			}

			// Store the token with the correct key
			localStorage.setItem('jwt_access_token', data.token);
			
			// Store user data for immediate use (including roles)
			localStorage.setItem('user_id', data.id);
			localStorage.setItem('user_email', data.email);
			localStorage.setItem('user_username', data.username);
			localStorage.setItem('user_roles', JSON.stringify(userRoles));
			console.log('JwtSignInForm - Stored roles in localStorage:', JSON.stringify(userRoles));
			
			// Reload the page to trigger the auth flow
			window.location.href = '/home';
			
		} catch (error: any) {
			setIsLoading(false);
			
			// Handle different error formats
			let errorMessage = 'Error al iniciar sesión';
			
			if (error?.data) {
				errorMessage = error.data;
			} else if (error?.message) {
				errorMessage = error.message;
			} else if (typeof error === 'string') {
				errorMessage = error;
			}
			
			handleErrorToast(errorMessage);
		}
	}

	return (
		<form
			name="loginForm"
			noValidate
			className="flex w-full flex-col justify-center space-y-5"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						sx={{
							'& .MuiOutlinedInput-input': {
								color: 'white',
							},
							'& .MuiInputLabel-root': {
								color: 'rgba(255, 255, 255, 0.8)',
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
							'& .MuiFormHelperText-root': {
								color: 'rgba(255, 255, 255, 0.7)',
							},
						}}
						label="Correo electrónico"
						autoFocus
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						sx={{
							'& .MuiOutlinedInput-input': {
								color: 'white',
							},
							'& .MuiInputLabel-root': {
								color: 'rgba(255, 255, 255, 0.8)',
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
							'& .MuiFormHelperText-root': {
								color: 'rgba(255, 255, 255, 0.7)',
							},
						}}
						label="Contraseña"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<div className="flex flex-col sm:flex-row items-center justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label={<span className="text-white text-sm">Recuérdame</span>}
								control={
									<Checkbox
										size="small"
										{...field}
										sx={{
											color: 'rgba(255, 255, 255, 0.7)',
											'&.Mui-checked': {
												color: 'white',
											},
										}}
									/>
								}
							/>
						</FormControl>
					)}
				/>
				<Link
					to="/forgot-password"
					className="text-sm text-gray-300 hover:text-white transition-colors"
				>
					¿Olvidaste tu contraseña?
				</Link>
			</div>

			<Button
				variant="contained"
				fullWidth
				size="large"
				type="submit"
				disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
				sx={{
					backgroundColor: '#3b82f6',
					'&:hover': {
						backgroundColor: '#2563eb',
					},
					'&:disabled': {
						backgroundColor: 'rgba(59, 130, 246, 0.5)',
						color: 'rgba(255, 255, 255, 0.5)',
					},
					textTransform: 'none',
					fontSize: '1rem',
					fontWeight: 600,
					py: 1.5,
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				}}
			>
				{isLoading ? (
					<div className="flex items-center gap-2">
						<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Iniciando sesión...
					</div>
				) : (
					'Iniciar sesión'
				)}
			</Button>
		</form>
	);
}

export default JwtSignInForm;