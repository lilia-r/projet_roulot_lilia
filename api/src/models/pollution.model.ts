import { DataTypes, Model, Sequelize } from 'sequelize';

export class Pollution extends Model {
  // Champs enregistrés pour chaque signalement de pollution.
  public id!: number;
  public title!: string;
  public description!: string;
  public location!: string;
  public level!: number;
}

export const initPollutionModel = (sequelize: Sequelize) => {
  // Décrit les colonnes de la table et leurs règles.
  Pollution.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: 'pollutions',
      timestamps: true,
    },
  );

  return Pollution;
};
