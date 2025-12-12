import React from 'react';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader/Loader';
import useRole from '../../hooks/useRole';
import Unauthorized from '../../pages/Errors/Unauthorized';

const AdminRoute = ({ children }) => {
  const { loading } = useAuth()
  const { role, roleLoading } = useRole();
  if (loading || roleLoading) {
    return <Loader />;
  }

  if (role !== 'admin' && role !== 'super-admin') {
    return <Unauthorized />
  }
  return children
};

export default AdminRoute;