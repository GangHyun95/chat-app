import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthImagePattern';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import GoogleLoginButton from '../components/googleLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login, isLoggingIn, googleClientId, getGoogleClientId } =
        useAuthStore();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(formData);
    };

    useEffect(() => {
        getGoogleClientId();
    }, [getGoogleClientId]);

    if (!googleClientId)
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        );

    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            {/* left */}
            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    {/* Logo */}
                    <div className='text-center mb-8'>
                        <div className='flex flex-col items-center gap-2 group'>
                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                <MessageSquare className='size-6 text-primary' />
                            </div>
                            <h1 className='text-2xl font-bold mt-2'>
                                Welcome Back!
                            </h1>
                            <p className='text-base-content/60'>
                                계정에 접속하여 서비스를 이용하세요.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='form-control'>
                            <label htmlFor='email' className='label'>
                                <span className='label-text font-medium'>
                                    Email
                                </span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className='size-5 text-base-content/40 z-10' />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder='이메일을 입력하세요.'
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className='form-control'>
                            <label htmlFor='password' className='label'>
                                <span className='label-text font-medium'>
                                    Password
                                </span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='size-5 text-base-content/40 z-10' />
                                </div>
                                <input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder='비밀번호를 입력하세요.'
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className='size-5 text-base-content/40 z-10' />
                                    ) : (
                                        <Eye className='size-5 text-base-content/40 z-10' />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='btn btn-primary w-full'
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className='size-5 animate-spin' />
                                    Loading...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>

                        <div className='flex items-center gap-4'>
                            <div className='flex-1 h-px bg-gray-300' />
                            <span className='text-sm text-muted-foreground'>
                                or
                            </span>
                            <div className='flex-1 h-px bg-gray-300' />
                        </div>
                        <GoogleOAuthProvider clientId={googleClientId}>
                            <GoogleLoginButton />
                        </GoogleOAuthProvider>
                    </form>

                    <div className='text-center'>
                        <p className='text-base-content/60'>
                            아직 계정이 없으신가요?{' '}
                            <Link to='/signup' className='link link-primary'>
                                회원가입
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* right */}
            <AuthImagePattern
                title='Join our community'
                subtitle='Connect with friends, share moments, and stay in touch with your loved ones'
            />
        </div>
    );
}
