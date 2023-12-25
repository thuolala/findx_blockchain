const { connectToDatabase } = require('../scripts/db');
import model from '../scripts/model';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const connection = await connectToDatabase();
    const [getSupplier] = await connection.execute('SELECT * FROM ncc');
    const listSupplier = getSupplier.map(getSupplier => new model.NCC(getSupplier.id, getSupplier.name, getSupplier.address, getSupplier.phone, getSupplier.email));

    return res.status(200).json(listSupplier);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
