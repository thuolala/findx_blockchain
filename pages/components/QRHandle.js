'use client';

import Image from 'next/image';
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

import {
  faHouse,
} 
from "@fortawesome/free-solid-svg-icons";

function QRHandle() {
  const [data, setData] = useState("No result");

  return (
    
    <main className="flex min-h-screen flex-col justify-between p-5 mb-auto bg-img">

      <header className="sticky top-0 z-50">
        <nav className="navbar sticky">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0 d-flex flex-col justify-between flow-root">
            <Link className="navbar-brand d-none d-xl-block text-white text-2xl float-left" href={"/"}>FindX</Link>
            <Link className="navbar-brand d-none d-xl-block mr-4 float-right" href={"/"}><FontAwesomeIcon icon={faHouse} style={{ fontSize: 20, color: "white" }}></FontAwesomeIcon></Link>
          </ul>
        </nav>
      </header>

      <div className='w-w50 h-h50 flex flex-col mx-auto my-auto container-fluid'>
        <QrReader className='border border-lime-custom '
            onResult = {(result, error) => {
              if (!!result) {
                setData(result?.text);
              }

              if (!!error) {
                console.info(error);
              }

            } 
          }
          //this is facing mode : "environment " it will open backcamera of the smartphone and if not found will 
          // open the front camera
          constraints = {{ facingMode:  "environment"  }}
          />

          <h1 className='text-center d-flex flex-col relative justify-center text-md mx-auto text-white mt-2 mb-2' style={{fontFamily: "Roboto Mono", fontWeight: 'lighter'}}>
            or
          </h1>

          <button type="submit" className="w-full text-white bg-lime-custom hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >Upload QR Code</button>

          <p className='text-white'>{data}</p>
      </div>

    </main>
  )
}

export default QRHandle;
