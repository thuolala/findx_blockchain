
import { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import html2canvas from 'html2canvas';
import QrCodeReader from 'qrcode-reader';
import jsQR from 'jsqr';
import { useRouter } from 'next/router';
import { TrackingContext} from '@/context/TrackingContext';

const Supplier = () => {
  const { getShipment, addShipment, getAllShipment} = useContext(TrackingContext);
  
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
  const [scannedQRData, setScannedQRData] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [shipmentDetails, setShipmentDetails] = useState('');
  const [productName, setProductName] = useState('');
  const [showPushUpBox, setShowPushUpBox] = useState(false);

  const router = useRouter();
  const {fullname} = router.query; 

  const handleAddShipment = () => {
    const shipmentDetails = {
      productId: productId,
      productName: name,
      category: categoryId,
      from: fullname,
      to: to,
      dateAdded: String(dateAdded),
      status: note
   };
    if (addShipment(shipmentDetails))
      setShowPushUpBox(true);

    // getAllShipment(productId)
    //   .then((aaa) => {
    //     alert(aaa.length)
    //   })
  };

  const loadData = (productId) => {
    getShipment(productId)
      .then((getShip) => {
        if (getShip) {
          setProductName(getShip.productName);
        }
      })
      .catch((error) => {
        console.error('Error getting shipment:', error);
      });
  };

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

    useEffect(() => {
      setFilteredSuppliers(suppliers.filter((supplier) => supplier.name !== fullname));
    }, [fullname, suppliers]);

  // Update other fields when productId changes
  useEffect(() => {
    // Find the selected product
    const selectedProduct = products.find((product) => product.id === productId);

    // Update other fields based on the selected product
    if (selectedProduct) {
      setId(selectedProduct.id);
      setName(selectedProduct.name);
      setCategoryId(selectedProduct.category_id);
    }
  }, [productId, products]);

  // Function to read data from a QR code image
  const readQRCodeFromImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          const pid = code.data
          resolve(pid);
          setProductId(pid)

          loadData(pid);

        } else {
          reject(new Error('No QR code found in the image.'));
        }
      };

      img.src = URL.createObjectURL(imageFile);
    });
  };
    
  // Function to handle QR code scanning from file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const qrCodeReader = new QrCodeReader();

            qrCodeReader.decode(canvas.toDataURL());

            // Set the scanned QR code data to display
            setScannedQRData(canvas.toDataURL());
            readQRCodeFromImage(file);
          };
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file contents:', error);
      }
    }
  };

  // Function to download the generated QR code as a PNG image
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
    <div className="flex h-screen bg-img">
      {/* Sidebar */}
      <Sidebar name={fullname}/>

      {/* Main content */}
      <main className="flex-1 flex p-8 bg-black backdrop-blur-sm bg-opacity-50">
        {/* Left side for reading and displaying QR code */}
        <div className="w-1/4 p-4 border-r border-gray-300">
          {/* Box to display QR code */}
          <div id="qrCodeContainer" className="bg-white p-2 shadow-md rounded-md mb-4 mx-auto" style={{ width : 'fit-content' }}>
            {scannedQRData ? (
              <img src={scannedQRData} alt="Scanned QR Code" className="max-w-full h-auto mx-auto" />
            ) : (
              <p className="text-center text-gray-500 font-robo">No QR Code scanned</p>
            )}
          </div>

          {/* Buttons for QR code actions */}
          <div className="flex justify-between">
            <label htmlFor="fileUpload" className="bg-black backdrop-blur-sm bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm">
              Upload
            </label>
            <input
              type="file"
              id="fileUpload"
              accept=".png"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              className="text-white bg-lime-custom hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={downloadQRCode}
              
            >
              Download
            </button>
          </div>

            {/* Push-up box */}
            {showPushUpBox && (
            <div className="bg-white backdrop-blur-sm rounded-lg mt-3 p-4 push-up-box fly-up-animation mx-auto " style={{ width: 'fit-content' }}>
              <button className='flex text-gray-400 rounded-md hover:bg-gray-100 ml-auto font-robo text-sm'
              onClick={() => setShowPushUpBox(false)}
            >
              X
            </button>
              <p className="text-center text-gray-500 font-robo mx-auto">New block added! </p>
            </div>
          )}
        </div>

        {/* Right side for adding a product */}
        <div className="w-3/4 p-4">
          <h2 className="text-2xl font-bold mb-4 text-lime-custom">Shipment</h2>
          {/* Shipment ID field */}
          {/* <div className="mb-4">
            <label htmlFor="shipmentId" className="block text-sm font-medium text-white">
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
          </div> */}

          {/* Product Name field */}
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-white">
            Product to ship
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productName}
              readOnly
              className="mt-1 p-2 w-full border rounded-md font-robo"
              disabled
            />
          </div>

          <div className="flex mb-4">
            <div className="w-1/2 mr-2">
            <label htmlFor="productId" className="block text-sm font-medium text-white">
              Product ID
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              value={productId}
              className="mt-1 p-2 w-full border rounded-md font-robo"
              disabled
              />
            </div>
            <div className="w-1/2 ml-2">
            <label htmlFor="category" className="block text-sm font-medium text-white">
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
                <option key={category.id} value={category.id} className='font-robo'>
                  {category.name}
                </option>
              ))}
            </select>
            </div>
          </div>

          <div className="mb-4">
          <label htmlFor="dateAdded" className="block text-sm font-medium text-white">
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
              <label htmlFor="from" className="block text-sm font-medium text-white">
                From
              </label>
              <input
                type="text"
                id="from"
                name="from"
                value={fullname}
                className="mt-1 p-2 w-full border rounded-md font-robo"
                disabled
              />
            </div>
            <div className="w-1/2 ml-2">
            <label htmlFor="to" className="block text-sm font-medium text-white">
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
              {filteredSuppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.name} className='font-robo'>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-white">
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
              className="text-white bg-lime-custom hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => handleAddShipment()}
            >
              Ship
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Supplier;

