import { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ path, ...props }) => {
  const { user } = useContext(AuthContext);

  return user ? (
    <Route {...props} path={path} />
  ) : (
    <Navigate to="/login" replace state={{ from: path }} />
  );
};

export default PrivateRoute;
