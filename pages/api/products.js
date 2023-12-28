const { connectToDatabase } = require('../scripts/db');
import model from '../scripts/model';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await connectToDatabase();
      const [getProduct] = await connection.execute('SELECT * FROM product');
      const listProduct = getProduct.map(getProduct => new model.Product(getProduct.id, getProduct.category_id, getProduct.name));

      return res.status(200).json(listProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { productId, categoryId, productName } = req.body;

    if (!categoryId || !productName) {
      return res.status(400).json({ message: 'Category ID and product name are required' });
    }

    try {
      const connection = await connectToDatabase();
      const insertQuery = 'INSERT INTO product (id, category_id, name) VALUES (?, ?, ?)';
      const [result] = await connection.execute(insertQuery, [productId, categoryId, productName]);

      const newProduct = new model.Product(productId, categoryId, productName);

      console.log('New product added:', newProduct);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
