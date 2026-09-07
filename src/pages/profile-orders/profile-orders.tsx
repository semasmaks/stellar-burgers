import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { ordersHistory, ordersHistoryIsInited } = useSelector(
    (state) => state.order
  );
  useEffect(() => {
    if (!ordersHistoryIsInited) dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={ordersHistory} />;
};
