
import React from 'react';
import Index from './Index';

// This component re-exports the Index component without adding a Router
const Home = () => {
  return <Index />;
};

export default Home;
