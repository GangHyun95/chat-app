import { LogOut } from 'lucide-react';

import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

import { FullPageSpinner } from '@/components/common/Spinner';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

export default function LogoutBtn() {
    const navigate = useNavigate();
    const setAccessToken = useAuthStore(state => state.setAccessToken);
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const { logout, isLoggingOut } = useLogout();
    const handleLogout = () => {
        logout(undefined, {
            onSuccess: ({ message }) => {
                setAccessToken(null);
                setAuthUser(null);
                toast.success(message);
                navigate('/login');
            },
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
