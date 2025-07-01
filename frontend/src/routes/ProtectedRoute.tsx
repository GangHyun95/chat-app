import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ isAllowed }: { isAllowed: boolean }) {
    return isAllowed ? <Outlet /> : <Navigate to='/login' replace />;
}

