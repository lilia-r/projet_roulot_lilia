import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/user.controllers';

const router = Router();

// Définit les actions disponibles pour la ressource utilisateurs.
router.get('/', getAllUsers);
router.post('/', createUser);

export default router;
