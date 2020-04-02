import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import users from '../app/models/User';
import Recipients from '../app/models/Recipients';
import Deliverymen from '../app/models/Deliverymen';
import Files from '../app/models/Files';
import Deliveries from '../app/models/Deliveries';
import Delivery_problems from '../app/models/DeliveryProblems';

const models = [
  users,
  Recipients,
  Files,
  Deliverymen,
  Deliveries,
  Delivery_problems,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
