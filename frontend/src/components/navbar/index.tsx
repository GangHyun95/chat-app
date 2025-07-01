import { MessageSquare, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import LogoutBtn from '@/components/navbar/LogoutBtn';

export default function Navbar() {
    return (
        <header className='border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex items-center justify-between h-full'>
                    <div className='flex items-center gap-8'>
                        <Link to='/' className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
                            <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                                <MessageSquare className='w-5 h-5 text-primary' />
                            </div>
                            <h1 className='text-lg font-bold'>Chat App</h1>
                        </Link>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Link to='/settings' className={`btn btn-sm gap-2 transition-colors`}>
                            <Settings className='w-4 h-4' />
                            <span className='hidden sm:inline'>Settings</span>
                        </Link>

                        <Link to='/profile' className='btn btn-sm gap-2'>
                            <User className='size-5' />
                            <span className='hidden sm:inline'>
                                Profile
                            </span>
                        </Link>
                        <LogoutBtn />
                    </div>
                </div>
            </div>
        </header>
    );
}
