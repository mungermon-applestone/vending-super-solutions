
import React from 'react';
import Index from './Index';

// This component just re-exports the Index component to provide compatibility
// with both naming conventions (Homepage and Index)
const Homepage: React.FC = () => {
  console.log('Homepage component rendering');
  return <Index />;
};

export default Homepage;
