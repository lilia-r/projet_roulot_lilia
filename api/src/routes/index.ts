import { Router } from 'express';
import pollutionRoutes from './pollution.routes';
import userRoutes from './user.routes';
import { signUp } from '../controllers/user.controllers';

const router = Router();

// Regroupe les routes de l'API par ressource (toutes préfixées par /api dans index.ts)
router.use('/pollutions', pollutionRoutes);
router.use('/users', userRoutes);
// Route d'inscription appelée par AuthService côté Angular (POST /api/signup)
router.post('/signup', signUp);

export default router;
