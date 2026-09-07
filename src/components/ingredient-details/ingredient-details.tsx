import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  setSelectedIngredient
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { selectedIngredient, ingredients } = useSelector(
    (state) => state.ingredients
  );

  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (!ingredients.length) dispatch(fetchIngredients());
    dispatch(setSelectedIngredient({ id: id }));
    return () => {
      dispatch(setSelectedIngredient(null));
    };
  }, [dispatch, ingredients.length]);

  if (!selectedIngredient || !ingredients.length) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
