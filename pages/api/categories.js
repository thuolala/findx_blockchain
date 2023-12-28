const { connectToDatabase } = require('../scripts/db');
import model from '../scripts/model';

// Assuming this is an async function
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (req.method === 'POST') {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    try {
      const connection = await connectToDatabase();
      const insertQuery = 'INSERT INTO category (name) VALUES (?)';
      const [result] = await connection.execute(insertQuery, [categoryName]);

      const newCategoryId = result.insertId;
      const newCategory = new model.Category(newCategoryId, categoryName);

      console.log('New category added:', newCategory);
      return res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error adding category:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const connection = await connectToDatabase();
      const [getCategory] = await connection.execute('SELECT * FROM category');
      const listCategory = getCategory.map(
        (getCategory) => new model.Category(getCategory.id, getCategory.name)
      );

      console.log(listCategory);
      return res.status(200).json(listCategory);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
