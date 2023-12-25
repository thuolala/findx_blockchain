// App.js or another parent component
import React from 'react';
import { TrackingProvider } from '@/context/TrackingContext';
import Manufacture from './components/Manufacture';

function App() {
  return (
    <TrackingProvider>
      <Manufacture />
    </TrackingProvider>
  );
}

export default App;
