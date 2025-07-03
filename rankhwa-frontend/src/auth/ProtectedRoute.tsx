import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from './useAuth';

export default function ProtectedRoute({children}: {children: ReactElement }) {
    const {user, loading} = useAuth();
    if(loading) return null;
    return user ? children : <Navigate to="/login" replace />;
}