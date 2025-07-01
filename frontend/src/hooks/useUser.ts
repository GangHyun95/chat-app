import { User } from '../types/user';
import { updateProfile } from '../service/user';
import { useApiAction } from '../service/api/client';

export function useProfileUpdate() {
    const { action, loading } = useApiAction<FormData, { data: { user: User }; message: string }>(updateProfile);
    return { updateProfile: action, isUpdatingProfile: loading };
}