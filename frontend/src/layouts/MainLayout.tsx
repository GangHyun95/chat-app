import { Outlet } from 'react-router-dom';

import Navbar from '@/components/navbar';
import { useThemeStore } from '@/store/useThemeStore';

export default function MainLayout() {
    const theme = useThemeStore((state) => state.theme);
    return (
        <div data-theme={theme} className='flex flex-col min-h-screen'>
            <Navbar />
            <main className='flex flex-col flex-1'>
                <Outlet />
            </main>
        </div>
    );
}
