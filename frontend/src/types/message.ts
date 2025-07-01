export type Message = {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image: string | null;
    createdAt: string;
};