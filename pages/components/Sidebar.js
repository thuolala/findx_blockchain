// components/Sidebar.js

import Link from 'next/link';
import {
    faSignOut,
    faHouse, 
    faUserEdit, 
    faList,
    faDashboard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = ({name}) => {
  return (
    <div className=" text-white h-full p-4 bg-black backdrop-blur-sm bg-opacity-70 ">
      <h2 className="text-xl font-bold mb-4">{name}</h2>

      <ul className="space-y-5">
        <Link href="#" >
          <li className="flex items-center" >
          <FontAwesomeIcon icon={faDashboard} className='mr-2 my-2'></FontAwesomeIcon>
          <p>Dashboard</p>
          </li>
        </Link>
        <Link href="/">
          <li className="flex items-center" >
          <FontAwesomeIcon icon={faList} className='mr-2 my-2'></FontAwesomeIcon>
          <p>Products</p>
          </li>
        </Link>
        <Link href="/">
          <li className="flex items-center" >
          <FontAwesomeIcon icon={faUserEdit} className='mr-2 my-2'></FontAwesomeIcon>
          <p>Edit</p>
          </li>
        </Link>
        <Link href="/">
          <li className="flex items-center" >
          <FontAwesomeIcon icon={faSignOut} className='mr-2 my-2'></FontAwesomeIcon>
          <p>Logout</p>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
