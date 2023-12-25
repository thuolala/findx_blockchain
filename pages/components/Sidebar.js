// components/Sidebar.js

import Link from 'next/link';
import {
    faSignOut,
    faHouse, 
    faUserEdit, 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = ({name}) => {
  return (
    <div className="bg-gray-800 text-white h-full p-4">
      <h2 className="text-xl font-bold mb-4">{name}</h2>

      <ul className="space-y-5">
      <Link href="/">
          <li className="flex items-center" >
          <FontAwesomeIcon icon={faHouse} className='mr-2 my-2'></FontAwesomeIcon>
          <p>Home</p>
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
