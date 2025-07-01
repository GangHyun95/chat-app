import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useCheckAuth, useGetMe } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';

export default function App() {
    const accessToken = useAuthStore(state => state.accessToken);
    const authUser = useAuthStore(state => state.authUser);
    const theme = useThemeStore((state) => state.theme);
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
            onError: console.error,
        });
    }, [accessToken]);

    useSocket();

    if ((isCheckingAuth && !accessToken) || (isGettingMe && authUser))
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        );

    return (
        <div data-theme={theme}>
            <Navbar />

            <Routes>
                <Route
                    path='/'
                    element={
                        accessToken ? <HomePage /> : <Navigate to='/login' />
                    }
                />
                <Route
                    path='/signup'
                    element={
                        !accessToken ? <SignUpPage /> : <Navigate to='/' />
                    }
                />
                <Route
                    path='/login'
                    element={!accessToken ? <LoginPage /> : <Navigate to='/' />}
                />
                <Route path='/settings' element={<SettingsPage />} />
                <Route
                    path='/profile'
                    element={
                        accessToken ? <ProfilePage /> : <Navigate to='/login' />
                    }
                />
            </Routes>
            <Toaster />
        </div>
    );
}
