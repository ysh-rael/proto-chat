import { User, sequelize } from 'models';

export default async function handler(req, res) {
  await sequelize.sync(); // Sincroniza tabelas (evite usar em produção toda hora)

  try {
    switch (req.method) {
      case 'POST': {
        // Criar usuário
        const { username } = req.body;
        if (!username) {
          return res.status(400).json({ error: 'Username é obrigatório' });
        }

        // Evitar duplicata
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return res.status(409).json({ error: 'Usuário já existe' });
        }

        const newUser = await User.create({ username });
        return res.status(201).json(newUser);
      }

      case 'GET': {
        // Buscar todos ou por id via query param ?id=...
        const { id } = req.query;

        if (id) {
          const user = await User.findByPk(id);
          if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
          }
          return res.status(200).json(user);
        } else {
          const users = await User.findAll();
          return res.status(200).json(users);
        }
      }

      case 'PUT': {
        // Editar usuário (recebe id e campos no body)
        const { id, username } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID do usuário é obrigatório' });
        }

        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (username) user.username = username;
        // atualize outros campos aqui, se existirem

        await user.save();
        return res.status(200).json(user);
      }

      case 'DELETE': {
        // Excluir usuário (recebe id no body)
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: 'ID do usuário é obrigatório' });
        }

        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.destroy();
        return res.status(200).json({ message: 'Usuário excluído com sucesso' });
      }

      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
