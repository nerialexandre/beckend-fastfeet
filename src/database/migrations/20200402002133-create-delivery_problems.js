module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Delivery_problems',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        delivery_id: {
          type: Sequelize.INTEGER,
          references: { model: 'Deliveries', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('Delivery_problems');
  },
};
