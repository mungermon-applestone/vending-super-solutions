
import React from 'react';
import Home from './Home';

// This component just re-exports the Home component to provide compatibility
// with both naming conventions (Homepage and Index)
const Homepage: React.FC = () => {
  console.log('Homepage component rendering');
  return <Home />;
};

export default Homepage;
