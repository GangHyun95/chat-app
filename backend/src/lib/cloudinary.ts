import { v2 as cloudinary } from 'cloudinary';

import { config } from 'dotenv';

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadAndReplaceImage = async (oldImageUrl: string | null, filePath: string): Promise<string> => {
    if (oldImageUrl) {
        await deleteImage(oldImageUrl);
    }

    try {
        const uploaded = await cloudinary.uploader.upload(filePath);
        return uploaded.secure_url;
    } catch (error) {
        console.error('Cloudinary 이미지 업로드 실패:', error);
        throw new Error('이미지 업로드에 실패했습니다.');
    }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
    const publicId = imageUrl.split('/').pop()?.split('.')[0] ?? '';

    if (!publicId) {
        console.warn('Cloudinary 삭제: publicId를 찾을 수 없습니다.');
        return;
    }
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary 이미지 삭제 완료: ${publicId}`);
    } catch (error) {
        console.error('Cloudinary 이미지 삭제 실패:', error);
    }
};