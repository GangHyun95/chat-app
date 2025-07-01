import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import UserList from '@/components/sidebar/UserList';
import SidebarSkeleton from '@/components/skeletons/SidebarSkeleton';
import { useSocket } from '@/hooks/useSocket';
import { useUserList } from '@/hooks/useUser';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types/user';

export default function Sidebar() {
    const [users, setUsers] = useState<User[]>([]);
    const authUser = useAuthStore(state => state.authUser);
    const { getUsers, isUsersLoading } = useUserList();

    useEffect(() => {
        getUsers(undefined, {
            onSuccess: (res) => {
                setUsers(res.data.users);
            },
            onError: (msg) => toast.error(msg),
        });
    }, []);

    const { onlineUsers } = useSocket();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;
    const otherOnlineUsers = onlineUsers.filter(id => id !== authUser?._id);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
            <div className='border-b border-base-300 w-full p-5'>
                <div className='flex items-center gap-2'>
                    <Users className='w-6 h-6' />
                    <span className='font-medium hidden lg:block'>
                        Contacts
                    </span>
                </div>
                <div className='mt-3 hidden lg:flex items-center gap-2'>
                    <label className='cursor-pointer flex items-center gap-2'>
                        <input
                            type='checkbox'
                            checked={showOnlineOnly}
                            onChange={(e) =>
                                setShowOnlineOnly(e.target.checked)
                            }
                            className='checkbox checkbox-sm'
                        />
                        <span className='text-sm'>Show online only</span>
                    </label>
                    <span className='text-xs text-zinc-500'>
                        ({otherOnlineUsers.length} online)
                    </span>
                </div>
            </div>

            <div className='overflow-y-auto w-full py-3 flex-1'>
                {filteredUsers.map((user) => (
                    <UserList
                        key={user._id}
                        user={user}
                        isOnline={onlineUsers.includes(user._id)}
                    />
                ))}

                {filteredUsers.length === 0 && (
                    <div className='text-center text-zinc-500 py-4'>
                        No online users
                    </div>
                )}
            </div>
        </aside>
    );
}
