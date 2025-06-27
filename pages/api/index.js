import { sequelize } from "../../models";

export default async function handler(req, res) {
    await sequelize.sync(); // Sincroniza as tabelas (evite em produção)
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return res.status(200).json({
    err: false,
    message: 'API ativa',
    dateServer: new Date().toLocaleString(),
  });
}
