import { Request, Response } from 'express';
import { validatePassword } from '../utils/hashPassword';
import { Admin } from '../models/Admin.model';
import { AssistenteSocial } from '../models/AssistenteSocial.model';
import { env } from '../config/envConfig';
import { Types } from "mongoose";
import jwt from 'jsonwebtoken';

interface BodyType {
  email: string;
  password: string;
}

export default class LoginController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as BodyType;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Email e senha devem ser strings' });
      }
      const userAdmin = await Admin.findOne({ email }).select("+password");
      const userAssistente = await AssistenteSocial.findOne({ email }).select("+password");

      const user = userAdmin ?? userAssistente;
      
      if (!user) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      if (!user.password || typeof user.password !== 'string' || user.password.trim() === '') {
        console.error('Password inválido no banco de dados para usuário:', user.email);
        return res.status(500).json({ message: 'Erro interno de configuração do usuário' });
      }

      const senhaValida = await validatePassword(password, user.password);
      
      if (!senhaValida) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { sub: (user._id as Types.ObjectId).toString() },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token });

    } catch (error) {
      console.error('Erro detalhado no login:', error);
     
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}