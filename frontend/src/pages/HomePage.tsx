import ChatContainer from '@/components/chat/ChatContainer';
import NoChatSelected from '@/components/chat/NoChatSelected';
import Sidebar from '@/components/sidebar';
import { useChatStore } from '@/store/useChatStore';

export default function HomePage() {
    const selectedUser = useChatStore((state) => state.selectedUser);
    return (
        <div className='flex-1 bg-base-200 pt-20'>
            <div className='flex items-center justify-center'>
                <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                    <div className='flex h-full rounded-lg overflow-hidden'>
                        <Sidebar />
                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    );
}
