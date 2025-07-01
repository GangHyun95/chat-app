import { AxiosError } from 'axios';
import { useState, useCallback } from 'react';

export function useApiAction<Payload, Response>(fn: (payload: Payload) => Promise<Response>, initialLoading = false) {
    const [loading, setLoading] = useState(initialLoading);

    const action = useCallback(async (payload: Payload, handlers: { onSuccess: (res: Response) => void; onError: (msg: string) => void }) => {
        setLoading(true);
        try {
            const res = await fn(payload);
            handlers.onSuccess(res);
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            const msg = err.response?.data?.message || err.message || 'Unknown error';
            handlers.onError(msg);
        } finally {
            setLoading(false);
        }
    }, [fn]);

    return { action, loading };
}
