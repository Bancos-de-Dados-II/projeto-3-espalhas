import {Beneficiario, IBeneficiario} from '../models/Beneficiario.model';

export default class BeneficiarioService {

    static async getAllBeneficiarios() {
        return await Beneficiario.find().exec();
    }
        static async insertBeneficiario(benefData: any) {
        try {
            console.log('Dados recebidos no service:', benefData);
            if (!benefData.criadoPor || !benefData.criadoPorTipo) {
                throw new Error('Campos criadoPor e criadoPorTipo são obrigatórios');
            }
            const newBenef = new Beneficiario(benefData);
            return await newBenef.save();
        } catch (error) {
            console.error('Erro no service:', error);
            throw error;
        }
    }

    static async getById(id: string) {
        return await Beneficiario.findById(id).exec();
    }

    static async editBenefById(id: string, data: any) {
        return Beneficiario.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    static async deleteBenefById(id: string) {
        await Beneficiario.findByIdAndDelete(id).exec();
    }
}
