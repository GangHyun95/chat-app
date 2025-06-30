import mongoose from 'mongoose';

const connection = { isConnected: null };

export const connectToDB = async () => {
    try {
        if (connection.isConnected) {
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_URI);
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("데이터베이스에 연결할 수 없습니다: ", error);
    }
};
