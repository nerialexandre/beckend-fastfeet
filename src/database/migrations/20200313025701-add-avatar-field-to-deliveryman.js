module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Deliverymen', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'Files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Deliverymen', 'avatar_id');
  },
};
