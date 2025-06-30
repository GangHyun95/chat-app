import { UserDoc } from '../user.ts';

declare global {
    namespace Express {
        interface Request {
            user: UserDoc;
        }
    }
}