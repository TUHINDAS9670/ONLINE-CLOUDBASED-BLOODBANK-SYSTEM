import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { getCurrentUser } from '../../redux/features/auth/authAction';
import { Navigate } from 'react-router-dom';
import API from '../../services/API';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track auth status
  const [loading, setLoading] = useState(true); // Track loading state
  const dispatch = useDispatch();

  // Fetch current user
  const getUser = async () => {
    try {
      const { data } = await API.get('/auth/current-user');
      if (data && data.success) {
        dispatch(getCurrentUser(data)); // Update Redux store
        
      }
    } catch (error) {
      console.log(error);
      localStorage.clear(); // Clear local storage if auth fails
      
    } 
  };

  useEffect(() => {
    getUser();
  });



  // Redirect to login if not authenticated
  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};


export default ProtectedRoute;
