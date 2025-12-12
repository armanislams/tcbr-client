import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';

const axiosSecure = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://scholar-stream-backend.vercel.app",
});

const useAxiosSecure = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    //intercept request
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user?.accessToken}`
      return config
    })

    ///interceptor response
    const resInterceptor = axiosSecure.interceptors.response.use((response) => {
      return response
    }, (error) => {
      console.log(error);

      const statusCode = error.response?.status;;
      // const statusCode = error.status;
      if (statusCode == 401) {
        navigate('/unauthorized')
      }
      if (statusCode == 403) {
        navigate('/forbidden')
      }

      

      return Promise.reject(error);

    })

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);

    }

  }, [user, navigate])
  return axiosSecure;
};

export default useAxiosSecure;