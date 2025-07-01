import Navbar from '@/components/Navbar';
import { useThemeStore } from '@/store/useThemeStore';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    const theme = useThemeStore((state) => state.theme);
    return (
        <div data-theme={theme} className='flex flex-col min-h-screen'>
            <Navbar />
            <Outlet />
        </div>
    );
}
