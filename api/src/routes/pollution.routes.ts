import { Router } from 'express';
import {
  getAllPollutions,
  createPollution,
  deletePollution,
} from '../controllers/pollution.controllers';

const router = Router();

// Associe chaque adresse et méthode HTTP à son contrôleur.
router.get('/', getAllPollutions);
router.post('/', createPollution);
router.delete('/:id', deletePollution);

export default router;
