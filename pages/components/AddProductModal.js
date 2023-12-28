import React, { useEffect, useState } from 'react'

function AddProductModal({ modal, setModal }) {
    const [ product, setProduct] = useState({
        productId: "",
        productName: "",
        categoryId: ""
      })
    const [categories, setCategories] = useState([]); 
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
    fetchCategories()
    },[])
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(product), 
            });
      
            const data = await response.json();
            console.log('New product added:', data);
            // if (response.ok) {
            // } else {
            //   console.error('Error:', response.statusText);
            // }
        } catch (error) {
            console.error('Error:', error);
        }
    }
  return modal && (
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='fixed inset-0 w-full h-full bg-black opacity-40'
        onClick={() => setModal(false)}></div>
      <div className='flex items-center min-h-screen px-4 py-8'>
        <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
          <div className='flex justify-end'>
            <button className='text-gray-400 rounded-md hover:bg-gray-100'
              onClick={() => setModal(false)}
            >
              X
            </button>
          </div>
          <div className='max-w-sm mx-auto py-3 space-y-3 text-center'>
            <h4 className='text-lg font-medium text-gray-800'>
              Create Product
            </h4>
        
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='relative mt-3'>
                <input 
                  type='text'
                  placeholder='Product Id'
                  className='w-full pl-5 pr-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setProduct({
                    ...product,
                    productId: e.target.value
                  })}
                />
                </div>
                <div className='relative mt-3'>
                <input 
                  placeholder='Product Name'
                  className='w-full pl-5 pr-3 py-2 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setProduct({
                    ...product,
                    productName: e.target.value
                  })}
                />
              </div>
              <div className='relative mt-3'>
                {/* <label htmlFor="category" className="block text-left text-sm font-medium text-gray-600">
                    Category
                </label> */}
                <select
                    id="category"
                    name="category"
                    value={product.categoryId}
                    onChange={(e) => setProduct({
                        ...product,
                        categoryId: e.target.value
                      })}
                    className="mt-1 p-2 w-full border rounded-md font-robo"
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
                
                <button onClick={handleClick}
                  className='block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2'
                >Create Product</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProductModal