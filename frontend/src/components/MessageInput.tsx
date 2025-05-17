import { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessageInput() {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sendMessage = useChatStore((state) => state.sendMessage);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file?.type.startsWith('image/')) {
            toast.error('이미지 파일을 선택해 주세요.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;
            if (typeof base64Image === 'string') {
                setImagePreview(base64Image);
            } else {
                console.error('파일 읽기 실패: Base64 문자열이 아님');
            }
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            setText('');
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error('메시지 전송 실패', error);
        }
    };

    return (
        <div className='p-4 w-full'>
            {imagePreview && (
                <div className='mb-3 flex items-center gap-3'>
                    <div className='relative'>
                        <img
                            src={imagePreview}
                            alt='Preview'
                            className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
                        />
                        <button
                            onClick={removeImage}
                            className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center'
                            type='button'
                        >
                            <X className='size-3' />
                        </button>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSendMessage}
                className='flex items-center gap-2'
            >
                <div className='flex-1 flex gap-2'>
                    <input
                        type='text'
                        className='w-full input rounded-lg'
                        placeholder='메시지를 입력해주세요...'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    <button
                        type='button'
                        className={`hidden sm:flex btn btn-circle ${
                            imagePreview ? 'text-emerald-500' : 'text-zinc-400'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type='submit'
                    className='btn btn-sm btn-circle'
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
}
