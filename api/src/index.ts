import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes'; // ou './routes/pollution.routes' selon ton organisation

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck pour Render (défini dans render.yaml)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Branchement des routes de l'API
app.use('/api', routes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
