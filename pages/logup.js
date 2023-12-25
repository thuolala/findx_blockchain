'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import React from "react";

export default function LogupModal({showModalLogup, setShowModalLogup}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const router = useRouter();

    const handleLogup = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, repassword }),
          });
    
          const data = await response.json();
    
          if (data.success) {
            console.log('Login successful');
            router.push('/manufacture');
          } else {
            console.error('Logup failed:', data.message);
          }
        } catch (error) {
          console.error('Error during logup:', error);
        }
      };

    return (

    <>
      {showModalLogup ? (
        <>

        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-sm "
            onClick={() => setShowModalLogup(false)}>
            <div className="relative p-4 w-full max-w-md max-h-full ">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 "
                      onClick={e => {
                      // do not close modal if anything inside modal content is clicked
                      e.stopPropagation();
                      }}>
                    <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Logup
                        </h3>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={handleLogup}>
                            <div>
                                <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-robo">Fullname</label>
                                <input type="text" name="name" id="name" className="bg-gray-50 border border-lime-custom text-gray-900 font-robo text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="abc" required 
                                    value={name} onChange={(e) => setName(e.target.value)}  />
                            </div>
                            <div>
                                <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-robo">Email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-lime-custom text-gray-900 font-robo text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@gmail.com" required 
                                    value={email} onChange={(e) => setEmail(e.target.value)}  />
                            </div>
                            <div>
                                <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-robo">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-lime-custom text-gray-900 font-robo text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required
                                    value={password} onChange={(e) => setPassword(e.target.value)}   />
                            </div>
                            <div>
                                <label for="repassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-robo">Re-enter password</label>
                                <input type="password" name="repassword" id="repassword" placeholder="••••••••" className="bg-gray-50 border border-lime-custom text-gray-900 font-robo text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required
                                    value={repassword} onChange={(e) => setRePassword(e.target.value)}   />
                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-lime-custom rounded bg-gray-50  accent-lime-custom dark:border-lime-custom focus:border-lime-custom" required/>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-lime-custom hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >Logup</button>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-300 font-robo">
                                Already have an account? <a href="#" className="text-lime-custom hover:text-black font-robo">Login now</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div> 


        </>
      ) : null}
    </>
  );
}