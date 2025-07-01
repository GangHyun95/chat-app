import { Loader } from 'lucide-react';

export function FullPageSpinner() {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-white text-primary'>
            <Loader className='size-10 animate-spin' />
        </div>
    );
}