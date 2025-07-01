import { X } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useSocket } from '@/hooks/useSocket';
import { useChatStore } from '@/store/useChatStore';

export default function ChatHeader() {
    const navigate = useNavigate();
    const selectedUser = useChatStore((state) => state.selectedUser);
    const setSelectedUser = useChatStore((state) => state.setSelectedUser);
    const handleExitChat = () => {
        navigate('/');
        setSelectedUser(null);
    };

    const { onlineUsers } = useSocket();
    return (
        <div className='p-2.5 border-b border-base-300'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='avatar'>
                        <div className='size-10 rounded-full relative'>
                            <div className='size-10 rounded-full relative'>
                                <img
                                    src={
                                        selectedUser?.profilePic ||
                                        '/avatar.png'
                                    }
                                    alt={selectedUser?.username}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className='font-medium'>
                            {selectedUser?.username}
                        </h3>
                        <p className='text-sm text-base-content/70'>
                            {selectedUser &&
                            onlineUsers.includes(selectedUser?._id)
                                ? 'Online'
                                : 'Offline'}
                        </p>
                    </div>
                </div>

                <button className='btn btn-ghost btn-circle' onClick={handleExitChat}>
                    <X />
                </button>
            </div>
        </div>
    );
}
