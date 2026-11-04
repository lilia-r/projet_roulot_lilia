import { Request, Response } from 'express';
import db from '../models';

// GET /api/pollutions
export const getAllPollutions = async (req: Request, res: Response) => {
  try {
    const list = await db.pollutions.findAll({
      order: [['id', 'DESC']],
    });

    const formatted = list.map((item: any) => {
      const p = item.toJSON ? item.toJSON() : item;
      return {
        id: p.id,
        title: p.title,
        titre: p.title || 'Signalement sans titre',
        description: p.description || '',
        location: p.location,
        lieu: p.location || 'Strasbourg',
        level: p.level || 1,
        type: p.description?.toLowerCase().includes('industriel') ? 'Industriel' : 'Déchets',
        dateObservation: p.createdAt
          ? new Date(p.createdAt).toISOString().split('T')[0]
          : '2026-11-04',
        photoUrl: '',
        latitude: null,
        longitude: null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des pollutions', error });
  }
};

// POST /api/pollutions
export const createPollution = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const title = body.titre || body.title || 'Signalement';
    const location = body.lieu || body.location || 'Strasbourg';
    const description = body.description || '';
    const level = body.level || 1;

    const createdInstance: any = await db.pollutions.create({
      title,
      description,
      location,
      level,
    });

    const created = createdInstance.toJSON ? createdInstance.toJSON() : createdInstance;

    const result = {
      id: created.id,
      titre: created.title,
      title: created.title,
      description: created.description,
      lieu: created.location,
      location: created.location,
      type: body.type || 'Déchets',
      dateObservation: body.dateObservation || new Date().toISOString().split('T')[0],
      photoUrl: body.photoUrl || '',
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      level: created.level,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création pollution', error });
  }
};

// DELETE /api/pollutions/:id
export const deletePollution = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Identifiant manquant' });
    }
    await db.pollutions.destroy({ where: { id } });
    return res.status(200).json({ success: true, id: Number(id) });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur suppression', error });
  }
};
