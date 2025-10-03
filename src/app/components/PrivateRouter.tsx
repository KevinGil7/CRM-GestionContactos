import { JSX } from "react";
import { Navigate } from "react-router-dom";
import useAuth from '@fuse/core/FuseAuthProvider/useAuth';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { authState } = useAuth();
  
  const isAuthenticated = authState?.isAuthenticated || false;
  const authStatus = authState?.authStatus || 'unauthenticated';

  // Show loading while authentication is being determined
  if (authStatus === 'configuring') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;