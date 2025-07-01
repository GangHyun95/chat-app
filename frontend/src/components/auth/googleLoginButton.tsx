import { useGoogleLogin } from '@react-oauth/google';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useGoogleAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

export default function GoogleLoginButton() {
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const { login, isLoggingIn } = useGoogleAuth();

    const googleLoginHandler = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (response) => {
            const code = response.code;
            await login({ code }, {
                onSuccess: ({ data, message }) => {
                    setAccessToken(data.accessToken);
                    toast.success(message);
                },
                onError: (msg) => toast.error(msg),
            });
        },
        onError: () => {
            toast.error('Google 로그인 실패');
        },
    });

    return (
        <button
            type='button'
            className='btn flex items-center w-full'
            disabled={isLoggingIn}
            onClick={() => googleLoginHandler()}
        >
            <img src='/google.png' alt='google' className='w-5' />
            {isLoggingIn ? (
                <>
                    <Loader2 className='size-5 animate-spin' />
                    Loading...
                </>
            ) : (
                'Google 계정으로 로그인'
            )}
        </button>
    );
}
