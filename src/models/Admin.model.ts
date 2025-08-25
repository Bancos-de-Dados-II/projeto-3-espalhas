import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password?: string;
  assistentesSociais: Schema.Types.ObjectId[];
  uuid: string;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: true },
  assistentesSociais: [{ type: Schema.Types.ObjectId, ref: 'AssistenteSocial' }],
  uuid: { type: String, required: true }
}, { timestamps: true });

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);