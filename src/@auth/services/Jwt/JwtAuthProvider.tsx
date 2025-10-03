import { useState, useEffect, useCallback, useMemo, useImperativeHandle } from 'react';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import { authSignIn, authSignInWithToken, authRefreshToken } from '@auth/authApi';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '../../../app/utils/apiFetch';
import { isTokenValid } from '@auth/services/Jwt/utils/jwtUtils';
import JwtAuthContext from '@auth/services/Jwt/JwtAuthContext';
import { JwtAuthContextType } from '@auth/services/Jwt/JwtAuthContext';
import { AuthResponse } from '../Jwt/Interfaces/auth-response.interface';
import { PartialDeep } from 'type-fest';

export type JwtSignInPayload = {
	email: string;
	password: string;
};

export type JwtSignUpPayload = {
	displayName: string;
	email: string;
	password: string;
};

function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	// Use localStorage directly for JWT token since it's a string, not JSON
	const getTokenStorageValue = () => {
		return localStorage.getItem('jwt_access_token');
	};

	const setTokenStorageValue = (token: string) => {
		localStorage.setItem('jwt_access_token', token);
	};

	const removeTokenStorageValue = () => {
		localStorage.removeItem('jwt_access_token');
	};

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * Attempt to auto login with the stored token
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = getTokenStorageValue();

			if (accessToken && isTokenValid(accessToken)) {
				try {
					// Get user data from localStorage (stored during login)
					const userId = localStorage.getItem('user_id');
					const userEmail = localStorage.getItem('user_email');
					const userUsername = localStorage.getItem('user_username');
					const userRoles = localStorage.getItem('user_roles');

					console.log('Auto-login - userId:', userId);
					console.log('Auto-login - userEmail:', userEmail);
					console.log('Auto-login - userUsername:', userUsername);
					console.log('Auto-login - userRoles:', userRoles);

					if (!userId || !userEmail || !userUsername) {
						// If no user data in localStorage, try to get it from the token
						console.log('Auto-login - No user data in localStorage, decoding token');
						const tokenParts = accessToken.split('.');
						if (tokenParts.length === 3) {
							const payload = tokenParts[1];
							const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
							const decodedPayload = atob(paddedPayload);
							const payloadObj = JSON.parse(decodedPayload);

							console.log('Auto-login - Decoded token payload:', payloadObj);

							const rolesFromToken = payloadObj['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ['Administrator'];
							console.log('Auto-login - Roles from token:', rolesFromToken);

							const userData = {
								id: payloadObj.uid || 'unknown',
								role: rolesFromToken,
								displayName: payloadObj.email || 'Usuario',
								photoURL: '',
								email: payloadObj.email || '',
								shortcuts: [],
								settings: {},
								loginRedirectUrl: '/home',
							};

							// Store the decoded data in localStorage
							localStorage.setItem('user_id', payloadObj.uid || 'unknown');
							localStorage.setItem('user_email', payloadObj.email || '');
							localStorage.setItem('user_username', payloadObj.sub || 'Usuario');
							localStorage.setItem('user_roles', JSON.stringify(rolesFromToken));
							console.log('Auto-login - Stored user data in localStorage');

							setTokenStorageValue(accessToken);
							setGlobalHeaders({ Authorization: `Bearer ${accessToken}` });

							return userData;
						}
						return false;
					}

					// Get stored roles from localStorage or use default
					const storedRoles = localStorage.getItem('user_roles');
					const roles = storedRoles ? JSON.parse(storedRoles) : ['Administrator'];

					// Create user data from localStorage
					const userData = {
						id: userId,
						role: roles,
						displayName: userUsername,
						photoURL: '',
						email: userEmail,
						shortcuts: [],
						settings: {},
						loginRedirectUrl: '/home',
					};

					setTokenStorageValue(accessToken);
					setGlobalHeaders({ Authorization: `Bearer ${accessToken}` });

					return userData;
				} catch {
					return false;
				}
			}

			return false;
		};

		// Only attempt auto login if we're still in configuring state
		if (authState.authStatus === 'configuring') {
			attemptAutoLogin().then((userData) => {
				if (userData) {
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: userData
					});
				} else {
					removeTokenStorageValue();
					removeGlobalHeaders(['Authorization']);
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			});
		}
		// eslint-disable-next-line
	}, []);

	/**
	 * Sign in
	 */
	const signIn: JwtAuthContextType['signIn'] = useCallback(
		async (credentials: JwtSignInPayload) => {
			try {
				const response = await authSignIn(credentials);

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
						console.log('JWT Provider - Extracted roles from token:', userRoles);
					}
				} catch (error) {
					console.error('Error decoding JWT token:', error);
				}

				// Store user data in localStorage for auto-login
				localStorage.setItem('user_id', data.id);
				localStorage.setItem('user_email', data.email);
				localStorage.setItem('user_username', data.username);
				localStorage.setItem('user_roles', JSON.stringify(userRoles));
				console.log('JWT Provider - Stored roles in localStorage:', JSON.stringify(userRoles));

				// Extract user data from your API response format
				const userData = {
					id: data.id,
					role: userRoles, // Use roles extracted from JWT token
					displayName: data.username,
					photoURL: '',
					email: data.email,
					shortcuts: [],
					settings: {},
					loginRedirectUrl: '/home',
				};

				setAuthState({
					authStatus: 'authenticated',
					isAuthenticated: true,
					user: userData
				});
				setTokenStorageValue(data.token);
				setGlobalHeaders({ Authorization: `Bearer ${data.token}` });

				return response;
			} catch (error) {
				// Re-throw the error so it can be handled by the component
				throw error;
			}
		},
		[setTokenStorageValue]
	);

	
	const signOut: JwtAuthContextType['signOut'] = useCallback(() => {
		removeTokenStorageValue();
		removeGlobalHeaders(['Authorization']);
		
		// Clean additional user data from localStorage
		localStorage.removeItem('user_id');
		localStorage.removeItem('user_email');
		localStorage.removeItem('user_username');
		localStorage.removeItem('user_roles');
		
		setAuthState({
			authStatus: 'unauthenticated',
			isAuthenticated: false,
			user: null
		});
	}, [removeTokenStorageValue]);

	/**
	 * Update user
	 */
	const updateUser: JwtAuthContextType['updateUser'] = useCallback(
		async (userData: PartialDeep<User>) => {
			if (authState.user) {
				setAuthState({
					...authState,
					user: { ...authState.user, ...userData } as User
				});
			}
			// Return a mock response for now
			return new Response(null, { status: 200 });
		},
		[authState]
	);
	
	/**
	 * Refresh access token
	 */
	const refreshToken: JwtAuthContextType['refreshToken'] = useCallback(async () => {
		const response = await authRefreshToken();

		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

		return response;
	}, []);

	/**
	 * Auth Context Value
	 */
	const authContextValue = useMemo(
		() =>
			({
				...authState,
				signIn,
				signOut,
				updateUser,
				refreshToken
			}) as JwtAuthContextType,
		[authState, signIn, signOut, updateUser, refreshToken]
	);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	/**
	 * Intercept fetch requests to refresh the access token
	 */
	const interceptFetch = useCallback(() => {
		const { fetch: originalFetch } = window;

		window.fetch = async (...args) => {
			const [resource, config] = args;
			const response = await originalFetch(resource, config);
			const newAccessToken = response.headers.get('New-Access-Token');

			if (newAccessToken) {
				setGlobalHeaders({ Authorization: `Bearer ${newAccessToken}` });
				setTokenStorageValue(newAccessToken);
			}

			if (response.status === 401) {
				signOut();

				console.error('Unauthorized request. User was signed out.');
			}

			return response;
		};
	}, [setTokenStorageValue, signOut]);

	useEffect(() => {
		if (authState.isAuthenticated) {
			interceptFetch();
		}
	}, [authState.isAuthenticated, interceptFetch]);

	return <JwtAuthContext value={authContextValue}>{children}</JwtAuthContext>;
}

export default JwtAuthProvider;