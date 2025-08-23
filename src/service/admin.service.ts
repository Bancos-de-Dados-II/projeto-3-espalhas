import { Admin, IAdmin } from "../models/Admin.model";
import Neo4jService from "./neo4j.service";

export default class AdminService {
  static async createAdmin(data: Partial<IAdmin>): Promise<IAdmin> {
    const admin = await Admin.create(data);
    try {
      await Neo4jService.createAdmin(admin.id, { email: admin.email, uuid: admin.uuid });
    } catch (err) {
      console.error("⚠️ Erro ao sincronizar Admin no Neo4j:", err);
    }

    return admin;
  }

  static async getByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).select("+password");
  }
}