import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';

import { FullPageSpinner } from '@/components/common/Spinner';
import { useCheckAuth, useGetMe } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import MainLayout from '@/layouts/MainLayout';
import { HomePage, LoginPage, ProfilePage, SettingsPage, SignUpPage } from '@/pages';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';

export default function App() {
    const accessToken = useAuthStore(state => state.accessToken);
    const authUser = useAuthStore(state => state.authUser);
    const setAccessToken = useAuthStore(state => state.setAccessToken);
    const setAuthUser = useAuthStore(state => state.setAuthUser);

    const { checkAuth, isCheckingAuth } = useCheckAuth();
    const { getMe, isGettingMe } = useGetMe();

    useEffect(() => {
        checkAuth(undefined, {
            onSuccess: ({ data }) => setAccessToken(data.accessToken),
            onError: console.error,
        });
    }, []);
    
    useEffect(() => {
        if (!accessToken) return;

        getMe(undefined, {
            onSuccess: ({ data }) => setAuthUser(data.user),
            onError: (msg) => {
                setAccessToken(null);
                setAuthUser(null);
                console.error(msg);
            }
        });
    }, [accessToken]);

    useSocket();

    if ((isCheckingAuth && !accessToken) || (isGettingMe && !authUser))
        return <FullPageSpinner />

    return (
        <>
            <Routes>
                <Route element={<ProtectedRoute isAllowed={!!accessToken} />}>
                    <Route element={<MainLayout />}>
                        <Route path='/:username?' element={<HomePage />} />
                        <Route path='profile' element={<ProfilePage />} />
                        <Route path='settings' element={<SettingsPage />} />
                    </Route>
                </Route>

                <Route
                    path='/login'
                    element={!accessToken ? <LoginPage /> : <Navigate to='/' replace />}
                />
                <Route
                    path='/signup'
                    element={!accessToken ? <SignUpPage /> : <Navigate to='/' replace />}
                />
            </Routes>

            <Toaster />
        </>
    );
}
