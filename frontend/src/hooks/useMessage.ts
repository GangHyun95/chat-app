import { useApiAction } from '@/service/api/client';
import { getMessages, sendMessage } from '@/service/message';
import { Message } from '@/types/message';

export function useMessagesByUser() {
    const { action, loading } = useApiAction<{ userId: string }, { data: { messages: Message[] }; message: string }>(getMessages);
    return { getMessages: action, isMessagesLoading: loading };
}

export function useSendMessage() {
    const { action, loading } = useApiAction<{ userId: string, formData: FormData }, { data: { message: Message }; message: string }>(sendMessage);
    return { sendMessage: action, isSendingMessage: loading };
}