import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuth = useSelector((state) => state.user.isUserAuth);

  if (!isAuth && !onlyUnAuth)
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  if (isAuth && onlyUnAuth)
    return <Navigate to={location.state?.from || '/'} replace />;

  return children;
};
