import { Camera, Mail, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useProfileUpdate } from '@/hooks/useUser';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
    const authUser = useAuthStore(state => state.authUser);
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const { updateProfile, isUpdatingProfile } = useProfileUpdate();
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);
        const formData = new FormData();
        formData.append('img', file);
        await updateProfile(formData, {
            onSuccess: ({ message, data }) => {
                toast.success(message);
                setAuthUser(data.user);
            },
            onError: (msg) => toast.error(msg),
        });
    };

    return (
        <div className='h-screen pt-20'>
            <div className='max-w-2xl mx-auto px-4 py-8'>
                <div className='bg-base-300 rounded-xl p-6 space-y-8'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold'>Profile</h1>
                        <p className='mt-2'>Your profile information</p>
                    </div>

                    {/* avater */}
                    <div className='flex flex-col items-center gap-4'>
                        <div className='relative'>
                            <img
                                src={
                                    imagePreviewUrl ||
                                    authUser?.profilePic ||
                                    '/avatar.png'
                                }
                                alt='Profile'
                                className='size-32 rounded-full object-cover border-4'
                            />
                            <label
                                htmlFor='avatar-upload'
                                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                                    isUpdatingProfile
                                        ? 'animate-pulse pointer-events-none'
                                        : ''
                                }`}
                            >
                                <Camera className='w-5 h-5 text-base-200' />
                                <input
                                    type='file'
                                    id='avatar-upload'
                                    className='hidden'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className='text-sm text-zinc-400'>
                            {isUpdatingProfile
                                ? 'Uploading...'
                                : '사진을 변경하려면 카메라 아이콘을 클릭하세요.'}
                        </p>
                    </div>

                    {/* input */}
                    <div className='space-y-6'>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-zinc-400 flex items-center gap-2'>
                                <User className='w-4 h-4' />
                                Full Name
                            </div>
                            <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                                {authUser?.fullName}
                            </p>
                        </div>

                        <div className='space-y-1.5'>
                            <div className='text-sm text-zinc-400 flex items-center gap-2'>
                                <Mail className='w-4 h-4' />
                                Email Address
                            </div>
                            <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>
                                {authUser?.email}
                            </p>
                        </div>
                    </div>

                    <div className='mt-6 bg-base-300 rounded-xl p-6'>
                        <h2 className='text-lg font-medium mb-4'>
                            Account Information
                        </h2>
                        <div className='space-y-3 text-sm'>
                            <div className='flex items-center justify-between py-2 border-b border-zind-700'>
                                <span>Member Since</span>
                                <span>
                                    {authUser?.createdAt?.split('T')[0]}
                                </span>
                            </div>
                            <div className='flex items-center justify-between py-2'>
                                <span>Type</span>
                                <span className='text-primary'>
                                    {authUser?.googleId
                                        ? 'Google 회원'
                                        : authUser
                                        ? '일반 회원'
                                        : 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
