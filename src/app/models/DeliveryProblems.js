import Sequelize, { Model } from 'sequelize';

class Delivery_problems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliveries, {
      foreignKey: 'delivery_id',
      as: 'Deliveries',
    });
  }
}

export default Delivery_problems;
