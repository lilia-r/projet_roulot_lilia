import express from 'express';
import cors from 'cors';
import routes from './routes';

// Création et configuration du serveur Express.
const app = express();
const port = Number(process.env.PORT) || 3000;

// Autorise les appels du navigateur et lit les données JSON des requêtes.
app.use(cors());
app.use(express.json());

// Route demandée par Render pour valider le démarrage
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Toutes les routes de l'API commencent par /api.
app.use('/api', routes);

// Démarre le serveur et affiche le port utilisé.
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
