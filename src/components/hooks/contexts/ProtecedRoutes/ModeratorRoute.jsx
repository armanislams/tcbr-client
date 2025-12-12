import React from 'react';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import Loader from '../../components/common/Loader/Loader';
import Unauthorized from '../../pages/Errors/Unauthorized';

const ModeratorRoute = ({ children }) => {
  const { loading ,user} = useAuth();
  const { role, roleLoading } = useRole();
  if (loading || !user || roleLoading) {
    return <Loader />;
  }

  if (role !== 'moderator' && role !== 'super-admin' ) {
    return <Unauthorized />;
  }
  return children;
};

export default ModeratorRoute;