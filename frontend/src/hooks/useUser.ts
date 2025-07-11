import { useApiAction } from '@/service/api/client';
import { getUserByUsername, getUsers, updateProfile } from '@/service/user';
import { User } from '@/types/user';

export function useUserList() {
    const { action, loading } = useApiAction<undefined, { data: { users: User[] }; message: string }>(getUsers);
    return { getUsers: action, isUsersLoading: loading };
}

export function useUserByUsername() {
    const { action, loading } = useApiAction<{ username: string }, { data: { user: User }; message: string } >(getUserByUsername);
    return { getUser: action, isUserLoading: loading };
}

export function useProfileUpdate() {
    const { action, loading } = useApiAction<FormData, { data: { user: User }; message: string }>(updateProfile);
    return { updateProfile: action, isUpdatingProfile: loading };
}