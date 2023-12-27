"use client";

import Image from 'next/image';
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import React from "react";
import LoginModal from './login';
import LogupModal from './logup';

import {
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [showModal, setShowModal] = React.useState(false);
  // const [showModalLogup, setShowModalLogup] = React.useState(false);

  return (
    <main className="flex min-h-screen flex-col justify-between p-5 bg-img">

      <header className="sticky top-0 z-50">
        <nav className="navbar sticky">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0 d-flex flex-col justify-between flow-root">
            <Link className="navbar-brand d-none d-xl-block text-white text-2xl float-left" href={""}>FindX</Link>
            <Link className="navbar-brand d-none d-xl-block mr-4 float-right" href={""}><FontAwesomeIcon icon={faHouse} style={{ fontSize: 20, color: "white" }}></FontAwesomeIcon></Link>
          </ul>
        </nav>
      </header>

      <h1 className='text-center d-flex flex-col relative justify-center text-xl text-lime-custom mx-auto mt-auto' style={{fontFamily: "Roboto Mono", fontWeight: 'lighter'}}>
        Welcome
      </h1>
      <div className="flex justify-content-center mx-auto grid grid-cols-3 mt-5 mb-5">
        <div className="p-2 sm:grid-cols-12 lg:grid-cols-4">
          <Link  href= '#'> 
          <Image className="login-box backdrop-blur-sm" src="/nsx_login.png" 
                                      width={180}
                                      height={180}
                                      alt="Picture login"
                                      onClick={() => setShowModal(true)}/>
          </Link> 
        </div>
        <div className="p-2 sm:grid-cols-12 lg:grid-cols-4">
        <Link  href= '#'> 
          <Image className="login-box backdrop-blur-sm" src="/ncc_login.png" 
                                      width={180}
                                      height={180}
                                      alt="Picture login"
                                      onClick={() => setShowModal(true)}/>
        </Link> 
        </div>
        <div className="p-2 sm:grid-cols-12 lg:grid-cols-4">
        <Link  href= '/customer'> 
          <Image className="login-box backdrop-blur-sm" src="/customer_login.png" 
                                      width={180}
                                      height={180}
                                      alt="Picture login"/>
        </Link> 
        </div>
      </div>
      <h1 className='text-center d-flex flex-col relative justify-center text-3xl text-white mx-auto mb-auto' style={{fontFamily: "Roboto Mono", fontWeight: 'lighter'}}>
        Supply Chain Service
      </h1>

      <LoginModal showModal={showModal} setShowModal={setShowModal}> 
      </LoginModal>

    </main>
  )
}
