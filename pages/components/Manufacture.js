
import { useRouter } from 'next/router';
import { useState, useEffect, useContext} from 'react';
import QRCode from 'react-qr-code';
import Sidebar from './Sidebar';
import html2canvas from 'html2canvas';
import { TrackingContext} from '@/context/TrackingContext';

const Manufacture = () => {
  const { addShipment, connectWallet, currentUser, getShipment } = useContext(TrackingContext);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dateProduce, setDateProduce] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState([]); // New state for categories
  const [generatedQR, setGeneratedQR] = useState(null);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [showPushUpBox, setShowPushUpBox] = useState(false);

  const handleAddShipment = () => {
    const shipmentDetails = {
      shipmentId: shipmentId,
      productId: productId,
      productName: name,
      category: categoryId,
      from: fullname,
      to: to,
      dateAdded: dateAdded,
      status: note
  };
  if (addShipment(shipmentDetails))
    setShowPushUpBox(true);
  };

  const router = useRouter();
  const {fullname} = router.query; 

  // Generate a random shipment ID
  useEffect(() => {
    const randomShipmentId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setShipmentId(randomShipmentId);
  }, []);

  // Fetch categories and products
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers');
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
    fetchCategories();
    fetchProducts();

  }, []);

  // Update other fields when productId changes
  useEffect(() => {
    // Find the selected product
    const selectedProduct = products.find((product) => product.id === productId);
    const randomShipmentId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // Update other fields based on the selected product
    if (selectedProduct) {
      setId(selectedProduct.id);
      setName(selectedProduct.name);
      setCategoryId(selectedProduct.category_id);
      setShipmentId(randomShipmentId);
    }
  }, [productId, products]);



  // Function to generate QR code based on the product ID
  const generateQRCode = () => {
    if (id) {
      const qrData = `${shipmentId}`;
      setGeneratedQR(qrData);
    }
  };

  // Function to download the generated QR code
  const downloadQRCode = () => {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
  
    if (qrCodeContainer) {
      html2canvas(qrCodeContainer).then((canvas) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'product_qr_code.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    }
  };  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar name={fullname}/>

      {/* Main content */}
      <main className="flex-1 flex p-8">
        {/* Left side for reading and displaying QR code */}
        <div className="w-1/4 p-4 border-r border-gray-300">
          {/* Box to display QR code */}
          <div className="bg-white p-2 shadow-md rounded-md mb-4 mx-auto" style={{ width: 'fit-content' }} id="qrCodeContainer">
            {generatedQR ? (
              <QRCode value={generatedQR} size={150} />
            ) : (
              <p className="text-center text-gray-500 font-robo">No QR Code generated</p>
            )}
          </div>

          {/* Buttons to generate and download QR code */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={generateQRCode}
            >
              Generate
            </button>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={downloadQRCode}
              disabled={!generatedQR}
            >
              Download
            </button>
          </div>

            {/* Push-up box */}
            {showPushUpBox && (
            <div className="bg-white p-4 shadow-md rounded-md mb-4 mx-auto push-up-box fly-up-animation" style={{ width: 'fit-content' }}>
              <p className="text-center text-gray-500 font-robo">Push-up Box Content </p>
              {/* Add more content as needed */}
            </div>
          )}
        </div>

        {/* Right side for adding a product */}
        
        <div className="w-3/4 p-4">

          <h2 className="text-2xl font-bold mb-4">Shipment</h2>
          {/* Shipment ID field */}
          <div className="mb-4">
            <label htmlFor="shipmentId" className="block text-sm font-medium text-gray-600">
              Shipment ID
            </label>
            <input
              type="text"
              id="shipmentId"
              name="shipmentId"
              value={shipmentId}
              readOnly
              className="mt-1 p-2 w-full border rounded-md font-robo"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="product" className="block text-sm font-medium text-gray-600">
              Choose a product to ship
            </label>
            <select
              id="product"
              name="product"
              value={productId}
              onChange={(e) => {
                const selectedProductId = e.target.value;
                setProductId(selectedProductId);

                // Fetch category ID based on the selected product ID
                const selectedProduct = products.find((product) => product.id === selectedProductId);
                if (selectedProduct) {
                  setCategoryId(selectedProduct.category_id);
                }
              }}
              className="mt-1 p-2 w-full border rounded-md font-robo"
            >
              <option value="" disabled className='font-robo'>
                Select Product
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id} className='font-robo'>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex mb-4">
            <div className="w-1/2 mr-2">
            <label htmlFor="id" className="block text-sm font-medium text-gray-600">
              ID
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md font-robo"
              disabled
              />
            </div>
            <div className="w-1/2 ml-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-600">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md font-robo"
              disabled
            >
              <option value="" disabled className='font-robo'>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            </div>
          </div>

          <div className="mb-4">
          <label htmlFor="dateAdded" className="block text-sm font-medium text-gray-600">
                Date Added
              </label>
              <input
                type="datetime-local"
                id="dateAdded"
                name="dateAdded"
                value={dateAdded}
                onChange={(e) => setDateAdded(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md font-robo"
              />
          </div>
          <div className="flex mb-4">
            <div className="w-1/2 mr-2">
              <label htmlFor="from" className="block text-sm font-medium text-gray-600">
                From
              </label>
              <input
                type="from"
                id="from"
                name="from"
                value={fullname}
                className="mt-1 p-2 w-full border rounded-md font-robo"
                disabled
              />
            </div>
            <div className="w-1/2 ml-2">
            <label htmlFor="to" className="block text-sm font-medium text-gray-600">
              To
            </label>
            <select
              id="to"
              name="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md font-robo"
            >
              <option value="" disabled className='font-robo'>
                Select Supplier
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.name} className='font-robo'>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <textarea
              id="status"
              name="status"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              className="mt-1 p-2 w-full border rounded-md font-robo"
            ></textarea>
          </div>
          

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => 
                handleAddShipment()}
              
            >
              Add
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Manufacture;

