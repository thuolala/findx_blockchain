// Your API route
import { connectToDatabase } from '../scripts/db';
import model from '../scripts/model';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  const connection = await connectToDatabase();

  try {
    const [getNSX] = await connection.execute('SELECT id, name, address, phone, email FROM nsx WHERE email = ?', [email]);
    const [getNCC] = await connection.execute('SELECT id, name, address, phone, email FROM ncc WHERE email = ?', [email]);

    if (getNSX.length !== 0 && getNCC.length === 0) {
      const newNSX = new model.NSX(getNSX[0].id, getNSX[0].name, getNSX[0].address, getNSX[0].phone, getNSX[0].email);
      return res.status(200).json({ success: true, message: 'Login successful', fullname: getNSX[0].name, role: 1 });
    } else if (getNSX.length === 0 && getNCC.length !== 0) {
      const newNCC = new model.NCC(getNCC[0].id, getNCC[0].name, getNCC[0].address, getNCC[0].phone, getNCC[0].email);
      return res.status(200).json({ success: true, message: 'Login successful', fullname: getNCC[0].name, role: 2 });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
}
