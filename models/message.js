module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sender: {
      type: DataTypes.ENUM('user', 'bot'),
      allowNull: false
    }
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Message;
};
