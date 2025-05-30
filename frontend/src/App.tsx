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
import { useShallow } from 'zustand/shallow';

export default function App() {
    const { checkAuth, isCheckingAuth, accessToken } = useAuthStore(
        useShallow((state) => ({
            checkAuth: state.checkAuth,
            isCheckingAuth: state.isCheckingAuth,
            accessToken: state.accessToken,
            logout: state.logout,
        }))
    );
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !accessToken)
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
