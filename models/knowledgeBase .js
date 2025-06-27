module.exports = (sequelize, DataTypes) => {
  const KnowledgeBase = sequelize.define('KnowledgeBase', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    source: {
      // URL ou origem do conteúdo
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      // Título ou contexto breve
      type: DataTypes.STRING,
      allowNull: true
    },
    text: {
      // Texto bruto
      type: DataTypes.TEXT,
      allowNull: false
    },
    embedding: {
      // Vetor em formato JSON
      type: DataTypes.JSON,
      allowNull: false
    },
    tags: {
      // Palavras-chave opcionais
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    chunkIndex: {
      // Útil caso o texto original tenha sido dividido em pedaços
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  return KnowledgeBase;
};
