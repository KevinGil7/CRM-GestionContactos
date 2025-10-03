
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import FuseAuthProvider from '@fuse/core/FuseAuthProvider'
import JwtAuthProvider from '@auth/services/Jwt/JwtAuthProvider'

createRoot(document.getElementById('root')!).render(
    <FuseAuthProvider 
        providers={[
            {
                name: 'jwt',
                Provider: JwtAuthProvider
            }
        ]}
    >
        {(authState) => <App />}
    </FuseAuthProvider>
)