import { Request, Response } from 'express';
import db from '../models';

// GET /api/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Récupère les utilisateurs sans inclure leur mot de passe dans la réponse.
    const users = await db.users.findAll({
      attributes: { exclude: ['password'] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération users', error });
  }
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    // Lit les informations reçues et crée un nouvel utilisateur dans la base.
    const { username, email, password } = req.body;
    const newUser = await db.users.create({ username, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création user', error });
  }
};
