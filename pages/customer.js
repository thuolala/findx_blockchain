import QRHandle from "./components/QRHandle";
import Link from 'next/link';
import { TrackingProvider } from '@/context/TrackingContext'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
} 
from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: 'Tracking product history',
};

function App() {
  
  return (
    <TrackingProvider>
      <QRHandle></QRHandle>
    </TrackingProvider>


  )
}

export default App;
