import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAssistenteSocial extends Document {
  nome: string;
  email: string;
  password?: string;
  telefone: string;
  adminId: Types.ObjectId; 
  beneficiarios: Types.ObjectId[];
}

const AssistenteSocialSchema = new Schema<IAssistenteSocial>({
  nome: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true,
    select: true 
  },
  telefone: { 
    type: String 
  },
  adminId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
  beneficiarios: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Beneficiario' 
  }]
}, { 
  timestamps: true
});



export const AssistenteSocial: Model<IAssistenteSocial> = mongoose.model<IAssistenteSocial>('AssistenteSocial', AssistenteSocialSchema);