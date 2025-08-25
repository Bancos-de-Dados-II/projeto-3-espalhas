import { Admin } from "../models/Admin.model";
import AdminService from "../service/admin.service";
import { hashPassword } from "../utils/hashPassword";
import { randomUUID } from "node:crypto";

export async function createDefaultAdmin() {
  const emailAdmin = 'admin@admin.com';
  const senhaAdmin = 'adminpass';

  const adminExistente = await Admin.findOne({ email: emailAdmin });
  if (!adminExistente) {
    const hashSenha = await hashPassword(senhaAdmin);
    const adminData = {
      email: emailAdmin,
      password: hashSenha,
      uuid: randomUUID(),
      assistentesSociais: []
    };
    await AdminService.createAdmin(adminData);
    console.log('Admin padrão criado');
  } else {
    console.log('Admin padrão já existe');
  }
}
