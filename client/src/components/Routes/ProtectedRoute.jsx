
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { getCurrentUser } from '../../redux/features/auth/authAction';
import { Navigate } from 'react-router-dom';
import API from '../../services/API';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const { data } = await API.get('/auth/current-user');
      if (data?.success) {
        dispatch(getCurrentUser(data));
        setAuth(true);
      } else {
        localStorage.clear();
        setAuth(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.clear();
      setAuth(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      setAuth(false);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white text-xl">
        Checking authentication...
      </div>
    );
  }
//redirect to homepage if user not loggedin or registered
  return auth ? children : <Navigate to="/homepage" />;
};

export default ProtectedRoute;
