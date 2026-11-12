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
    const { username, email, password } = req.body;

    // 1. Vérification de la présence et du caractère non vide des champs obligatoires
    if (
      typeof username !== 'string' ||
      !username.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: 'Les champs username, email et password sont obligatoires.',
      });
    }

    // 2. Vérification du format de l'email et de la longueur minimale du mot de passe
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Format d’email invalide.' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 6 caractères.',
      });
    }

    // 3. Vérification de l'unicité de l'email en base de données
    const existingUser = await db.users.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // 4. Création de l'utilisateur dans la base
    const newUser = await db.users.create({
      username: username.trim(),
      email: normalizedEmail,
      password,
    });

    // On renvoie l'utilisateur créé sans exposer son mot de passe
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur création user', error });
  }
};
