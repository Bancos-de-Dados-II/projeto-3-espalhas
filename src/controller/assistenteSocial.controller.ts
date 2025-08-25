import { Request, Response, NextFunction } from "express";
import { hashPassword } from "../utils/hashPassword";
import AssistenteSocialService from "../service/assistenteSocial.service";
import { IAssistenteSocial } from "../models/AssistenteSocial.model";
import { Types } from "mongoose";

export default class AssistenteSocialController {
  static async createAssistenteSocial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, telefone, nome } = req.body;
      const adminId = (req as any).userId;

      const existingAssist = await AssistenteSocialService.getByEmail(email);
      if (existingAssist) {
        res.status(409).json({ message: 'Este email já está cadastrado.' });
      }

      const hashPass = await hashPassword(password);
      const assistData: Partial<IAssistenteSocial> = { 
        email, 
        password: hashPass, 
        telefone, 
        nome, 
        adminId: new Types.ObjectId(adminId)
      };

      const newAssist = await AssistenteSocialService.createAssistenteSocial(assistData);
      (newAssist as any).password = undefined;

      res.status(201).json(newAssist);
    } catch (error) {
      next(error); 
    }
  }
  static async getAllAssistentes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AssistenteSocialService.getAllAssistentes();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async getAssistById(req: Request, res: Response, next: NextFunction): Promise<void>  {
    try {
      const { id } = req.params;
      const assistente = await AssistenteSocialService.getById(id);

      if (!assistente) {
        res.status(404).json({ message: 'Assistente social não encontrado.' });
      }
      
      res.status(200).json(assistente);
    } catch (error) {
      next(error);
    }
  }
  static async editAssist(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
      const { id } = req.params;
      const assistente = await AssistenteSocialService.editAssistById(id, req.body);

      if (!assistente) {
        res.status(404).json({ message: 'Assistente social não encontrado para edição.' });
      }

      res.status(200).json(assistente);
    } catch (error) {
      next(error);
    }
  }
  static async deleteAssist(req: Request, res: Response, next: NextFunction): Promise<void>  {
    try {
      const { id } = req.params;
      const deletedAssist = await AssistenteSocialService.deleteAssistById(id);

      if (!deletedAssist) {
        res.status(404).json({ message: 'Assistente social não encontrado para exclusão.' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}