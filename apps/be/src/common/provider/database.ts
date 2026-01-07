import { Sequelize } from 'sequelize-typescript';
import { Todo } from '../entities/todo';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        // password: 'password',
        database: 'mydb',
      });
      sequelize.addModels([Todo]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
