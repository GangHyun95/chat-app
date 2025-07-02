import mongoose from 'mongoose';

const { ConnectionStates } = mongoose;

type ConnState = typeof ConnectionStates[keyof typeof ConnectionStates] | null;

const connection: { isConnected: ConnState } = { isConnected: null };

export const connectToDB = async () => {
    try {
        if (connection.isConnected) {
            return;
        }
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI 환경 변수가 설정되지 않았습니다.');
        }

        const db = await mongoose.connect(mongoUri);
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("데이터베이스에 연결할 수 없습니다: ", error);
    }
};
