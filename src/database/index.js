import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import users from '../app/models/User';
import Recipients from '../app/models/Recipient';
import Deliverymen from '../app/models/Deliveryman';
import Files from '../app/models/Files';

const models = [users, Recipients, Files, Deliverymen];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
