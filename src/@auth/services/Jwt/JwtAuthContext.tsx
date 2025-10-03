import { FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { User } from '@auth/user';
import { createContext } from 'react';
import { JwtSignInPayload } from '@auth/services/Jwt/JwtAuthProvider';
import { PartialDeep } from 'type-fest';

export type JwtAuthContextType = FuseAuthProviderState<User> & {
	signIn?: (credentials: JwtSignInPayload) => Promise<Response>;
	signOut?: () => void;
	updateUser?: (userData: PartialDeep<User>) => Promise<Response>;
	refreshToken?: () => Promise<string | Response>;
};

const defaultAuthContext: JwtAuthContextType = {
	authStatus: 'configuring',
	isAuthenticated: false,
	user: null,
};

const JwtAuthContext = createContext<JwtAuthContextType>(defaultAuthContext);

export default JwtAuthContext;