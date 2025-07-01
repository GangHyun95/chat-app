import ChatContainer from '@/components/chat/ChatContainer';
import NoChatSelected from '@/components/chat/NoChatSelected';
import Sidebar from '@/components/sidebar';
import { useParams } from 'react-router-dom';

export default function HomePage() {
    const { username } = useParams();
    return (
        <div className='flex-1 bg-base-200 pt-15 px-0 lg:pt-20 lg:px-4'>
            <div className='flex items-center justify-center'>
                <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-60px)] lg:h-[calc(100vh-8rem)]'>
                    <div className='flex h-full rounded-lg overflow-hidden'>
                        <Sidebar />
                        {!username ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    );
}
