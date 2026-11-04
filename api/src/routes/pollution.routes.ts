import { Router } from 'express';
import {
  getAllPollutions,
  createPollution,
  deletePollution,
} from '../controllers/pollution.controllers';

const router = Router();

router.get('/', getAllPollutions);
router.post('/', createPollution);
router.delete('/:id', deletePollution);

export default router;
