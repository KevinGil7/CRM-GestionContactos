import apiFetch  from '@app/utils/apiFetch';

export async function authRefreshToken(): Promise<Response> {
	return apiFetch('/auth/refresh', { method: 'POST' });
}

/**
 * Sign in with token
 */
export async function authSignInWithToken(accessToken: string): Promise<Response> {
	return apiFetch('/auth/renew', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
}

export async function authSignIn(credentials: { email: string; password: string }): Promise<Response> {
	return apiFetch('/auth/login', {
		method: 'POST',
		body: JSON.stringify(credentials)
	});
}