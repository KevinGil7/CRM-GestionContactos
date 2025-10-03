// Simple JWT validation without external library
export const isTokenValid = (accessToken: string) => {
	if (!accessToken) {
		return false;
	}

	try {
		// Split the JWT token
		const parts = accessToken.split('.');
		if (parts.length !== 3) {
			return false;
		}

		// Decode the payload (second part)
		const payload = parts[1];
		
		// Add padding if needed for base64 decoding
		const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
		
		// Decode base64
		const decodedPayload = atob(paddedPayload);
		const payloadObj = JSON.parse(decodedPayload);

		// Check if token has expiration
		if (!payloadObj.exp) {
			return false;
		}

		// Check if token is not expired
		const currentTime = Date.now() / 1000;
		return payloadObj.exp > currentTime;

	} catch (error) {
		console.error('Error validating JWT token:', error);
		return false;
	}
};