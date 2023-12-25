const { connectToDatabase } = require('../scripts/db');
import model from '../scripts/model';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const connection = await connectToDatabase();
    const [getProduct] = await connection.execute('SELECT * FROM product');
    const listProduct = getProduct.map(getProduct => new model.Product(getProduct.id, getProduct.category_id, getProduct.name));

    return res.status(200).json(listProduct);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
