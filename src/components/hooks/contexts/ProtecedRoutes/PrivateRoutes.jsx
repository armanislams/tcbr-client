import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Loader from '../../components/common/Loader/Loader';
import useAuth from '../../hooks/useAuth';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth()
    const location = useLocation()
    if (loading) {
        return <Loader/>
    }
    if (!user) {
        return <Navigate to={'/login'} state={location.pathname}></Navigate>
    }
    return children;
};

export default PrivateRoutes;