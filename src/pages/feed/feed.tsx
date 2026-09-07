import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const { orders, isFeedLoading, error } = useSelector((state) => state.feed);
  const { isIngredientsLoading } = useSelector((state) => state.ingredients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orders.length) dispatch(fetchOrders());
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isFeedLoading || isIngredientsLoading || !orders.length)
    return <Preloader />;
  if (error) return <div>{error}</div>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
