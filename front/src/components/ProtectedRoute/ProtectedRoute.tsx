import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAuth();
  return isConnected ? <>{children}</> : <Navigate to="/login" replace />;
}
