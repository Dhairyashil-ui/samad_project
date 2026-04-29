import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    if (token) {
      loginWithToken(token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [token, loginWithToken, navigate]);

  return <Loader />;
};

export default AuthSuccess;
