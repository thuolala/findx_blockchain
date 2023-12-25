const { connectToDatabase } = require('../scripts/db');
import model from '../scripts/model';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const connection = await connectToDatabase();
    const [getCategory] = await connection.execute('SELECT * FROM category');
    const listCategory = getCategory.map(getCategory => new model.Category(getCategory.id, getCategory.name));
    console.log(listCategory);
    return res.status(200).json(listCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
