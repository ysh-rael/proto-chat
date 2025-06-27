import { Message, User, sequelize } from 'models';

export default async function handler(req, res) {
  await sequelize.sync(); // Sincroniza as tabelas (evite em produção)

  try {
    switch (req.method) {
      case 'POST': {
        // Criar mensagem
        const { content, sender, userId } = req.body;

        if (!content || !sender || !userId) {
          return res.status(400).json({ error: 'content, sender e userId são obrigatórios' });
        }

        // Verifica se usuário existe
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const newMessage = await Message.create({ content, sender, userId });
        return res.status(201).json(newMessage);
      }

      case 'GET': {
        // Listar mensagens ou buscar por id ?id=UUID
        const { id } = req.query;

        if (id) {
          const message = await Message.findByPk(id, { include: User });
          if (!message) {
            return res.status(404).json({ error: 'Mensagem não encontrada' });
          }
          return res.status(200).json(message);
        } else {
          const messages = await Message.findAll({ include: User });
          return res.status(200).json(messages);
        }
      }

      case 'PUT': {
        // Editar mensagem (id e campos no body)
        const { id, content, sender } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'ID da mensagem é obrigatório' });
        }

        const message = await Message.findByPk(id);
        if (!message) {
          return res.status(404).json({ error: 'Mensagem não encontrada' });
        }

        if (content) message.content = content;
        if (sender) message.sender = sender;

        await message.save();
        return res.status(200).json(message);
      }

      case 'DELETE': {
        // Excluir mensagem (id no body)
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'ID da mensagem é obrigatório' });
        }

        const message = await Message.findByPk(id);
        if (!message) {
          return res.status(404).json({ error: 'Mensagem não encontrada' });
        }

        await message.destroy();
        return res.status(200).json({ message: 'Mensagem excluída com sucesso' });
      }

      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
