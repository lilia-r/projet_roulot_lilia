import { Sequelize } from 'sequelize';
import { initPollutionModel } from './pollution.model';
import { initUserModel } from './user.model';

const connectionUrl = process.env.DATABASE_URL;

// La base de données doit être configurée dans les variables d'environnement.
if (!connectionUrl) {
  throw new Error('La variable DATABASE_URL doit être définie pour connecter la base de données.');
}

const sequelize = new Sequelize(connectionUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: true,
  },
});

// Prépare les modèles utilisés par les contrôleurs.
export const db = {
  Sequelize,
  sequelize,
  pollutions: initPollutionModel(sequelize),
  users: initUserModel(sequelize),
};

export default db;
