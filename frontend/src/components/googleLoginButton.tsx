import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useGoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton() {
    const { googleLogin, isLoggingIn } = useAuthStore();

    const googleLoginHandler = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (response) => {
            const code = response.code;
            await googleLogin(code);
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

