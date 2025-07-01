import { useNavigate, useParams } from 'react-router-dom';

import { User } from '@/types/user';

type Props = {
    user: User;
    isOnline: boolean;
}
export default function UserList({ user, isOnline} : Props) {
    const navigate = useNavigate();
    const { username } = useParams();
    const isSelected = username === user.username;
    return (
        <button
            onClick={() => navigate(`/${user.username}`)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer ${
                isSelected ? 'bg-base-300 ring-1 ring-base-300' : ''
            }`}
        >
            <div className='relative mx-auto lg:mx-0'>
                <img
                    src={user.profilePic || '/avatar.png'}
                    alt={user.username}
                    className='size-12 object-cover rounded-full'
                />
                {isOnline && (
                    <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900' />
                )}
            </div>

            <div className='hidden lg:block text-left min-w-0'>
                <div className='font-medium truncate'>
                    {user.username}
                </div>
                <div className='text-sm text-zinc-400'>
                    {isOnline ? 'Online' : 'Offline'}
                </div>
            </div>
        </button>
    );
}

