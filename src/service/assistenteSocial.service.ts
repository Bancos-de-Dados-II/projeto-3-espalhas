import { AssistenteSocial, IAssistenteSocial } from './../models/AssistenteSocial.model';
import Neo4jService from "./neo4j.service";
import { Types } from 'mongoose';

export default class AssistenteSocialService {
  static async createAssistenteSocial(data: Partial<IAssistenteSocial>): Promise<IAssistenteSocial> {
    const assistente = await AssistenteSocial.create(data);
    try {
      await Neo4jService.createAssistenteSocial(
        assistente._id.toString(),
        assistente.adminId.toString(),
        { nome: assistente.nome, email: assistente.email, telefone: assistente.telefone }
      );
    } catch (err) {
      console.error("⚠️ Erro ao sincronizar com Neo4j:", err);
    }

    return assistente;
  }

  static async getAllAssistentes(): Promise<{ total: number, assistentes: IAssistenteSocial[] }> {
    const assistentes = await AssistenteSocial.find();
    const total = await AssistenteSocial.countDocuments();
    return { total, assistentes };
  }

  static async getById(id: string): Promise<IAssistenteSocial | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return AssistenteSocial.findById(id);
  }
  static async getByEmail(email: string): Promise<IAssistenteSocial | null> {
    return AssistenteSocial.findOne({ email });
  }

  static async editAssistById(id: string, data: Partial<IAssistenteSocial>): Promise<IAssistenteSocial | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return AssistenteSocial.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteAssistById(id: string): Promise<IAssistenteSocial | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return AssistenteSocial.findByIdAndDelete(id);
  }
}