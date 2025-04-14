
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import Home from './pages/Index';
import Products from './pages/Products';
import Machines from './pages/Machines';
import BusinessGoals from './pages/BusinessGoals';
import MachineDetail from './pages/MachineDetail';
import ProductDetail from './pages/ProductDetail';
import BusinessGoalDetail from './pages/BusinessGoalDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productSlug" element={<ProductDetail />} />
        <Route path="/machines" element={<Machines />} />
        <Route path="/machines/:machineType/:machineId" element={<MachineDetail />} />
        <Route path="/goals" element={<BusinessGoals />} />
        <Route path="/goals/:goalSlug" element={<BusinessGoalDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
