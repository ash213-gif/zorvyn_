import { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    lastLogin: Date;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=user.d.ts.map