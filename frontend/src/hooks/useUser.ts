import { User } from '../types/user';
import { getUsers, updateProfile } from '../service/user';
import { useApiAction } from '../service/api/client';

export function useUserList() {
    const { action, loading } = useApiAction<undefined, { data: { users: User[] }; message: string }>(getUsers);
    return { getUsers: action, isUsersLoading: loading };
}

export function useProfileUpdate() {
    const { action, loading } = useApiAction<FormData, { data: { user: User }; message: string }>(updateProfile);
    return { updateProfile: action, isUpdatingProfile: loading };
}