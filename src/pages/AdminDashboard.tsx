
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Redirect to the main admin page
  useEffect(() => {
    navigate('/admin');
  }, [navigate]);
  
  // This content won't be shown as we're redirecting
  return (
    <div className="container mx-auto py-10">
      <p>Redirecting to admin page...</p>
    </div>
  );
};

export default AdminDashboard;
