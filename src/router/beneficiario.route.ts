
import { Router } from 'express';
import BeneficiarioController from '../controller/beneficiario.controller';
import asyncHandler from 'express-async-handler';
import { verifyToken } from '../middlewares/verifyJwt.middleware';

const BenefRouter = Router();

const authMiddleware = (req: any, res: any, next: any) => {
  return verifyToken(req, res, next);
};
BenefRouter.get('/combo', asyncHandler(BeneficiarioController.filterByNomeAndLocation));
BenefRouter.get('/', asyncHandler(BeneficiarioController.getBenefs));
BenefRouter.get('/:id', asyncHandler(BeneficiarioController.getBenefById));

BenefRouter.post('/', authMiddleware, asyncHandler(BeneficiarioController.createBenefs));
BenefRouter.patch('/:id', authMiddleware, asyncHandler(BeneficiarioController.editBenef));
BenefRouter.delete('/:id', authMiddleware, asyncHandler(BeneficiarioController.deleteBenef));

export default BenefRouter;