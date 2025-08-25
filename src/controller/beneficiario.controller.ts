import { NextFunction, Request, Response } from 'express';
import BeneficiarioService from '../service/beneficiario.service';
import { Beneficiario } from '../models/Beneficiario.model';
import mongoose from 'mongoose';

export default class BeneficiarioController {
    static async getBenefs(req: Request, res: Response) {
        try {
            const benefs = await BeneficiarioService.getAllBeneficiarios();
            res.status(200).json(benefs);
        } catch {
            res.status(400).json('Nenhum beneficiario encontrado!');
        }
    }

    static async getBenefById(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            res.status(400).json('O ID do beneficiário não foi identificado.');
        }

        try {
            const benef = await BeneficiarioService.getById(id);
            res.status(200).json(benef);
        } catch (err) {
            console.log(err);
            res.status(400).json('Erro ao buscar beneficiario!');
        }
    }

    static async filterByNomeAndLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { nome, lng, lat, distancia } = req.query;
            let query: any = {};

            if (nome && typeof nome === 'string') {
                query.nome = { $regex: nome, $options: 'i' };
            }

            if (lng && lat) {
                const coordinates = [parseFloat(lng as string), parseFloat(lat as string)];

                if (coordinates.some(isNaN) || coordinates.length !== 2) {
                    res.status(400).json({
                        success: false,
                        message: 'Coordenadas inválidas'
                    });
                    return;
                }

                const maxDistance = distancia ? parseInt(distancia as string) * 1000 : 5000;

                query.location = {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates
                        },
                        $maxDistance: maxDistance
                    }
                };
            }

            if (!query.nome && !query.location) {
                res.status(400).json({
                    success: false,
                    message: 'Forneça pelo menos um critério de busca (nome ou localização)'
                });
                return;
            }

            const benefs = await Beneficiario.find(query);

            res.status(200).json({
                success: true,
                count: benefs.length,
                data: benefs
            });
        } catch (error) {
            console.error('Erro na busca combinada:', error);
            next(error);
        }
    }
    
    static async createBenefs(req: Request, res: Response) {
        const { nome, nome_responsavel, data_nascimento, location, phone1, phone2 } = req.body;
        
        const authenticatedReq = req as any;
        const userId = authenticatedReq.userId;
        const userType = authenticatedReq.userType;

        if (!userId || !userType) {
            res.status(401).json('Usuário não autenticado');
        }

        if (!nome || !nome_responsavel || !data_nascimento || !location || !phone1 || !phone2) {
            res.status(400).json('Nome, Nome do Responsável, Data de Nascimento ou Localização não foi especificado.');
        }

        try {
            const benefData = {
                ...req.body,
                criadoPor: userId,
                criadoPorTipo: userType
            };

            const newBenef = await BeneficiarioService.insertBeneficiario(benefData);
            
            res.status(201).json(newBenef);
        } catch (err: any) {
            console.log(err);
            
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map((error: any) => error.message);
                res.status(400).json({
                    message: 'Dados inválidos',
                    errors: errors
                });
            }
            
            res.status(400).json('Erro ao cadastrar beneficiario!');
        }
    }

    static async editBenef(req: Request, res: Response) {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json('ID do beneficiário inválido.');
        }
        const authenticatedReq = req as any;
        if (!authenticatedReq.userId || !authenticatedReq.userType) {
            res.status(401).json('Usuário não autenticado');
        }

        try {
            const benefEdited = await BeneficiarioService.editBenefById(id, req.body);
            res.status(200).json(benefEdited);
        } catch (err) {
            console.log(err);
            res.status(400).json('Erro ao editar beneficiario!');
        }
    }

    static async deleteBenef(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        if (!id) {
            res.status(400).json('O ID do beneficiário não foi identificado.');
            return;
        }
        const authenticatedReq = req as any;
        if (!authenticatedReq.userId || !authenticatedReq.userType) {
            res.status(401).json('Usuário não autenticado');
            return;
        }

        try {
            const beneficiario = await BeneficiarioService.getById(id);

            if (!beneficiario) {
                res.status(404).json('Beneficiário não encontrado.');
                return;
            }

            await BeneficiarioService.deleteBenefById(beneficiario.id);
            res.status(200).json('Beneficiário excluído!');
        } catch (error) {
            console.error('Erro ao excluir beneficiário:', error);
            res.status(500).json('Erro interno ao excluir o beneficiário.');
        }
    }
}