import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Route demandée par Render pour valider le démarrage
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api', routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
