// App.js or another parent component
import React from 'react';
import { TrackingProvider } from '@/context/TrackingContext';
import Supplier from './components/Supplier';
function App() {
  return (
    <TrackingProvider>
      <Supplier />
    </TrackingProvider>
  );
}

export default App;
