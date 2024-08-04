// src/sessionModel.ts
import mongoose, { Document, Schema } from 'mongoose';

interface ISession extends Document {
    clientId: string;
    session: object;
}

const sessionSchema: Schema = new Schema({
    clientId: { type: String, required: true, unique: true },
    session: { type: Object, required: true },
});

const Session = mongoose.model<ISession>('Session', sessionSchema);
export default Session;