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

			// Store the token with the correct key
			localStorage.setItem('jwt_access_token', data.token);
			
			// Store user data for immediate use
			localStorage.setItem('user_id', data.id);
			localStorage.setItem('user_email', data.email);
			localStorage.setItem('user_username', data.username);
			
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
			className="mt-8 flex w-full flex-col justify-center"
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
								color: 'white', // texto dentro del input
							},
							'& .MuiInputLabel-root': {
								color: 'white', // label normal
							},
							'& .MuiInputLabel-root.Mui-focused': {
								color: 'white', // label en foco
							},
							'& .MuiOutlinedInput-root': {
								backgroundColor: 'rgba(255, 255, 255, 0.1)', // fondo translúcido
								'& fieldset': {
									borderColor: 'white', // borde normal
								},
								'&:hover fieldset': {
									borderColor: 'white', // borde al pasar el mouse
								},
								'&.Mui-focused fieldset': {
									borderColor: 'white', // borde en foco
								},
							},
							'& .MuiFormHelperText-root': {
								color: 'white', // color del helper text
							},
						}}
						className="mb-6"
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
								color: 'white', // texto dentro del input
							},
							'& .MuiInputLabel-root': {
								color: 'white', // label normal
							},
							'& .MuiInputLabel-root.Mui-focused': {
								color: 'white', // label en foco
							},
							'& .MuiOutlinedInput-root': {
								backgroundColor: 'rgba(255, 255, 255, 0.1)', // fondo translúcido
								'& fieldset': {
									borderColor: 'white', // borde normal
								},
								'&:hover fieldset': {
									borderColor: 'white', // borde al pasar el mouse
								},
								'&.Mui-focused fieldset': {
									borderColor: 'white', // borde en foco
								},
							},
							'& .MuiFormHelperText-root': {
								color: 'white', // color del helper text
							},
						}}
						className="mb-6"
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

			<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Recuerdame"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>
			</div>

			<Button
				variant="contained"
				color="secondary"
				className=" mt-4 w-full border-2 border-secondary text-white hover:bg-secondary/90"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
				type="submit"
				size="large"
			>
				{isLoading ? 'Cargando...' : 'Iniciar sesión'}
			</Button>
		</form>
	);
}

export default JwtSignInForm;