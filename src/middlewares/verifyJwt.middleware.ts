import { NextFunction, Request, Response } from "express";
import { env } from "../config/envConfig";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Admin } from '../models/Admin.model';
import { AssistenteSocial } from '../models/AssistenteSocial.model';

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers["token"] as string || 
                 req.headers["authorization"]?.replace('Bearer ', '') || 
                 req.query.token as string;

    console.log('Token recebido:', token);

    if (!token) {
      console.log('Token não encontrado nos headers:', req.headers);
      res.status(401).json({ message: "Token não fornecido" });
      return;
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    const admin = await Admin.findById(payload.sub);
    const assistente = await AssistenteSocial.findById(payload.sub);

    if (admin) {
      (req as any).userId = payload.sub as string;
      (req as any).userType = 'Admin';
    } else if (assistente) {
      (req as any).userId = payload.sub as string;
      (req as any).userType = 'AssistenteSocial';
    } else {
      console.log('Usuário não encontrado para ID:', payload.sub);
      res.status(401).json({ message: "Usuário não encontrado" });
      return;
    }

    console.log('Token válido para usuário:', { 
      userId: (req as any).userId, 
      userType: (req as any).userType 
    });

    next();
    return; 

  } catch (err) {
    console.log('Erro ao verificar token:', err);
    res.status(401).json({ message: "Token inválido" });
    return;
  }
}