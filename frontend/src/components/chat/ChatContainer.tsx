import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { useParams } from 'react-router-dom';

import MessageSkeleton from '@/components/skeletons/MessageSkeleton';
import { useMessagesByUser } from '@/hooks/useMessage';
import { useMessagesSubscription } from '@/hooks/useMessagesSubscription';
import { useUserByUsername } from '@/hooks/useUser';
import { formatMessageTime } from '@/lib/util';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';

export default function ChatContainer() {
    const { username } = useParams();
    const { getUser, isUserLoading } = useUserByUsername();
    const { getMessages, isMessagesLoading } = useMessagesByUser();

    const authUser = useAuthStore((state) => state.authUser);
    const messages = useChatStore(state => state.messages);
    const setMessages = useChatStore(state => state.setMessages);
    const selectedUser = useChatStore(state => state.selectedUser);
    const setSelectedUser = useChatStore(state => state.setSelectedUser);

    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!username) return;

        setMessages([]);
        getUser({ username }, {
            onSuccess: ({ data: { user } }) => {
                getMessages({ userId: user._id }, {
                    onSuccess: ({ data: { messages } }) => {
                        setSelectedUser(user);
                        setMessages(messages);
                    },
                    onError: toast.error,
                });
            },
            onError: toast.error,
        });
    }, [username]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useMessagesSubscription();
    
    if (isUserLoading || (isMessagesLoading && messages.length === 0)) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => (
                    <div
                        key={message._id}
                        ref={endRef}
                        className={`chat ${message.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}
                    >
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img
                                    src={
                                        message.senderId === authUser?._id ? authUser?.profilePic || '/avatar.png' : selectedUser?.profilePic || '/avatar.png'
                                    }
                                    alt='profile pic'
                                />
                            </div>
                        </div>
                        <div className='chat-header mb-1'>
                            <time className='text-xs opacity-50 ml-1'>
                                {message.createdAt && formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className='chat-bubble flex flex-col'>
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt='Attachment'
                                    className='sm:max-w-[200px] rounded-md mb-2'
                                />
                            )}
                            {message.text && <p className='whitespace-pre-wrap break-words'>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
}
