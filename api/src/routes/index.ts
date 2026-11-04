import { Router } from 'express';
import pollutionRoutes from './pollution.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/pollutions', pollutionRoutes);
router.use('/users', userRoutes);

export default router;
