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
      type: DataTypes.ENUM('user', 'bot', 'system'),
      allowNull: false
    },
    timestamp: {
      // Data da mensagem (nome mais comum que "data")
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    responseTime: {
      // Tempo de resposta em segundos (float)
      type: DataTypes.FLOAT,
      allowNull: true
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
