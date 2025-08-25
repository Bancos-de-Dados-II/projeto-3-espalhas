import mongoose from 'mongoose';
import {env} from './envConfig';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGOOSE);
        console.log('✅ Conectado ao MongoDB Atlas com sucesso');
    } catch (err) {
        console.error('❌ Erro ao conectar ao MongoDB Atlas:', err);
    }
};
