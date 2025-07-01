import { LogOut } from 'lucide-react';

import toast from 'react-hot-toast';

import { FullPageSpinner } from '@/components/common/Spinner';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

export default function LogoutBtn() {
    const setAccessToken = useAuthStore(state => state.setAccessToken);
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const { logout, isLoggingOut } = useLogout();
    const handleLogout = () => {
        setAccessToken(null);
        setAuthUser(null);
        logout(undefined, {
            onSuccess: ({ message }) => toast.success(message),
            onError: (msg) => toast.error(msg),
        });
    };

    if (isLoggingOut) return <FullPageSpinner />;
    return (
        <button className='btn btn-sm btn-ghost' onClick={handleLogout}>
            <LogOut className='size-5' />
            <span className='hidden sm:inline'>Logout</span>
        </button>
    );
}
