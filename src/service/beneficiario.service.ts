import {Beneficiario, IBeneficiario} from '../models/Beneficiario.model';
import Neo4jService from "./neo4j.service";

export default class BeneficiarioService {

    static async insertBeneficiario(benefData: any) {
        try {
            console.log('Dados recebidos no service:', benefData);

            if (!benefData.criadoPor || !benefData.criadoPorTipo) {
            throw new Error('Campos criadoPor e criadoPorTipo são obrigatórios');
            }
            const newBenef = await Beneficiario.create(benefData);
            try {
            await Neo4jService.createBeneficiario(
                newBenef.id,
                newBenef.criadoPor.toString(),
                newBenef.criadoPorTipo,
                { nome: newBenef.nome, data_nascimento: newBenef.data_nascimento }
            );
            } catch (err) {
            console.error("⚠️ Erro ao sincronizar beneficiário no Neo4j:", err);
            }

            return newBenef;
        } catch (error) {
            console.error('Erro no service:', error);
            throw error;
        }
    }

    static async getById(id: string) {
        return await Beneficiario.findById(id).exec();
    }

    
    static async getAllBeneficiarios() {
        return await Beneficiario.find();
    }

    static async editBenefById(id: string, data: any) {
        return Beneficiario.findByIdAndUpdate(id, data, {new: true}).exec();
    }

    static async deleteBenefById(id: string) {
        await Beneficiario.findByIdAndDelete(id).exec();
        await Neo4jService.deleteBeneficiario(id);
    }
}
