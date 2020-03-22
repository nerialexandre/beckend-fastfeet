import Sequelize, { Model } from 'sequelize';
import format from 'date-fns/format';

class Deliveries extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return (
              format(new Date(), 'HH:mm:ss') > '08:00:00' &&
              format(new Date(), 'HH:mm:ss') < '18:00:00'
            );
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associeate(models) {
    this.belongsTo(models.Recipients, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliverymen, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.Files, { foreignKey: 'signature_id', as: 'file' });
  }
}

export default Deliveries;
