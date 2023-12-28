'use client';

import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import React, { useState, useContext, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { QrReader } from "react-qr-reader";
import QrScanner from "qr-scanner";
import { TrackingContext } from '@/context/TrackingContext';
import {
  faHouse,
} 
from "@fortawesome/free-solid-svg-icons";

const QRHandle = () => {
  const [data, setData] = useState("No result");
  const [count, setCount] = useState('');

  const {getAllShipment} = useContext(TrackingContext);

  const loadData = (result) => {
    getAllShipment(result)
      .then((ships) => {
        setCount(ships.length)
        displayTracking(ships)
      })
  };

  const displayTracking = (history) => {
    const displayTrackingDiv = document.getElementById("displayTracking");
  
    if (displayTrackingDiv) {
      const contentArray = history.map((product, index) => (
        <div
          key={index}
          className="border-lime-custom bg-black backdrop-blur-sm bg-opacity-50 rounded-lg mt-2 p-4"
        >
          <h4 className="text-white mx-auto">Block #{index}</h4>
          <p className="text-white font-robo">Product ID: {product.productId}</p>
          <p className="text-white font-robo">Product Name: {product.productName}</p>
          <p className="text-white font-robo">Category: {product.category}</p>
          <p className="text-white font-robo">From: {product.from}</p>
          <p className="text-white font-robo">To: {product.to}</p>
          <p className="text-white font-robo">Date Added: {product.dateAdded}</p>
          <p className="text-white font-robo">Status: {product.status}</p>
        </div>
      ));
  
      ReactDOM.render(contentArray, displayTrackingDiv);
    }
  };
  
  //UPLOAD QR  
  const [ file, setFile ] = useState(null)
  const [ qrResult, setQrResult ] = useState(null)
  const fileRef = useRef()

  const handleClick = () => {
    fileRef.current.click()
    console.log(file)
  }
  const handleChange = async (e) => {
    const file = e.target.files[0]
    setFile(file)
    const result = await QrScanner.scanImage(file)
    setData(result)
    loadData(String(result));
  }

  return (
    <main className="flex min-h-screen  flex-col justify-between p-5 bg-img"> 
      <header className=" sticky top-0 z-50 ">
          <nav className="navbar sticky ">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0 d-flex flex-col justify-between flow-root ">
              <Link className="navbar-brand d-none d-xl-block text-white text-2xl float-left" href={"/"}>FindX</Link>
              <Link className="navbar-brand d-none d-xl-block mr-4 float-right" href={"/"}><FontAwesomeIcon icon={faHouse} style={{ fontSize: 20, color: "white" }}></FontAwesomeIcon></Link>
            </ul>
          </nav>
        </header>

        {/* Left for qr reader */}
        <div className="lg:w-1/2 w-full lg:mx-auto lg:my-auto"> 
          <div className='w-w50 h-h50 flex flex-col mx-auto my-auto '>
          <QrReader className='border-lime-custom bg-black backdrop-blur-sm bg-opacity-50 rounded-lg' 
              onResult = {(result, error) => {
                if (!!result) {
                  setData(result?.text);
                  loadData(String(result?.text));
                }

                if (!!error) {
                  console.info(error);
                }

              } 
            }
            constraints = {{ facingMode:  "environment"  }}
            />

            <h1 className='text-center d-flex flex-col relative justify-center text-md mx-auto text-white mt-2 mb-2' style={{fontFamily: "Roboto Mono", fontWeight: 'lighter'}}>
              or
            </h1> 

            <button type="submit" 
                onClick={handleClick}
                className=" w-full text-white bg-lime-custom hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >Upload QR Code</button>
              <input type="file" accept=".png, .jpg, .jpeg" hidden 
                ref={fileRef}
                onChange={handleChange}
              />
              {file && (
                <div className="flex justify-center items-center my-3 ">
                  <img src={URL.createObjectURL(file)} className="rounded-lg"/>
                </div>
              )}

            <p className='text-white font-robo mx-auto'>Product Id: {data}</p>
        </div>
        </div>

        {/* Right for display block */}

        <div className="lg:w-1/2 w-full lg:mx-auto lg:my-auto">
          <div className="lg:w-1/2 lg:my-auto lg:mx-auto" id="displayTracking">
            
          </div>

        </div>


      </main>

  )
}

export default QRHandle;
