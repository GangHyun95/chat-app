import { useRef, useState } from 'react';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';
import { useSendMessage } from '../hooks/useMessage';

export default function MessageInput() {
    const [text, setText] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addMessage = useChatStore(state => state.addMessage);
    const selectedUser = useChatStore(state => state.selectedUser);
    const { sendMessage, isSendingMessage } = useSendMessage();

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim() && !imagePreviewUrl) return;
        if (!selectedUser) return;

        const formData = new FormData();
        if (text.trim()) formData.append('text', text.trim());
        if (imageFile)   formData.append('img', imageFile);

        await sendMessage({userId: selectedUser._id, formData}, {
            onSuccess: ({ data }) => {
                addMessage(data.message);
                setText('');
                resetImage();
            },
            onError: (msg) => toast.error(msg),
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        if (!file?.type.startsWith('image/')) {
            toast.error('이미지 파일을 선택해 주세요.');
            return;
        }

        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);
        setImageFile(file);
    };

    const resetImage = () => {
        imagePreviewUrl && URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    return (
        <div className='p-4 w-full'>
            {imagePreviewUrl && (
                <div className='mb-3 flex items-center gap-3'>
                    <div className='relative'>
                        <img
                            src={imagePreviewUrl}
                            alt='Preview'
                            className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
                        />
                        <button
                            onClick={resetImage}
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
                            imagePreviewUrl ? 'text-emerald-500' : 'text-zinc-400'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type='submit'
                    className='btn btn-sm btn-circle'
                    disabled={!text.trim() && !imageFile}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
}
