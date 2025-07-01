import { useApiAction } from '@/service/api/client';
import { getMe, googleLogin, login, logout, refreshAccessToken, signup } from '@/service/auth';
import { LoginPayload, SignupPayload } from '@/types/auth';
import { User } from '@/types/user';

export function useSignup() {
    const { action, loading } = useApiAction<SignupPayload, { data: { accessToken: string }, message: string }>(signup);
    return { signup: action, isSigningUp: loading };
}

export function useLogin() {
    const { action, loading } = useApiAction<LoginPayload, { data: { accessToken: string }, message: string }>(login);
    return { login: action, isLoggingIn: loading };
}

export function useLogout() {
    const { action, loading } = useApiAction<void, { message: string }>(logout);
    return { logout: action, isLoggingOut: loading };
}

export function useCheckAuth() {
    const { action, loading } = useApiAction<void, { data: { accessToken: string }, message: string }>(refreshAccessToken, true);
    return { checkAuth: action, isCheckingAuth: loading };
}

export function useGetMe() {
    const { action, loading } = useApiAction<void, { data: { user: User }, message: string }>(getMe);
    return { getMe: action, isGettingMe: loading };
}

export function useGoogleAuth() {
    const { action, loading } = useApiAction<{ code: string }, { data: { accessToken: string }, message: string }>(googleLogin);
    return { login: action, isLoggingIn: loading };
}
