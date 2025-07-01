import { MessageSquare } from 'lucide-react';

export default function NoChatSelected() {
    return (
        <div className='w-full flex flex-1 flex-col p-16 bg-base-100/50'>
            <div className='flex-1 flex flex-col items-center justify-center text-center space-y-6'>
                <div className='flex justify-center gap-4 mb-4'>
                    <div className='relative'>
                        <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce'>
                            <MessageSquare className='w-8 h-8 text-primary' />
                        </div>
                    </div>
                </div>

                <h2 className='text-2xl font-bold'>Welcome to Chat App!</h2>
                <p className='text-base-content/60'>
                    사이드바에서 유저를 선택하면 채팅을 시작할 수 있어요.
                </p>
            </div>
        </div>
    );
}
