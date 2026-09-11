import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isUserAuth, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) return <Preloader />;
  if (!isUserAuth && !onlyUnAuth)
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  if (isUserAuth && onlyUnAuth)
    return <Navigate to={location.state?.from || '/'} replace />;

  return children;
};
