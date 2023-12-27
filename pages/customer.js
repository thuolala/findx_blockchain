import QRHandle from "./components/QRHandle";
import Link from 'next/link';
import { TrackingProvider } from '@/context/TrackingContext'; 

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
