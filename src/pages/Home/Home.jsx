import React from 'react';
import { Navigate } from 'react-router';

const Home = () => {
    return <Navigate to={'/dashboard'}></Navigate>
};

export default Home;