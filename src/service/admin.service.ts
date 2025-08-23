import { Admin, IAdmin } from "../models/Admin.model";

export default class AdminService {
  static async createAdmin(data: Partial<IAdmin>): Promise<IAdmin> {
    const admin = new Admin(data);
    return admin.save();
  }

  static async getByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).select("+password");
  }
}
