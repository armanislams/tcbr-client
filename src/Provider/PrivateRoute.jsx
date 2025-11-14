import React, { use } from "react";
import { Navigate, useLocation } from "react-router";
import Loader from "../components/Loader";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = use(AuthContext);
  const location = useLocation();
  if (loading) {
    return <Loader></Loader>;
  } else if (!user) {
    return <Navigate to={"/login"} state={location.pathname}></Navigate>;
  } else {
    return children;
  }
};

export default PrivateRoute;
