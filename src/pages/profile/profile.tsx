import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { updateUser } from '../../services/slices/userSlice';
import { TRegisterData } from '@api';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const { isUserLoading, isAuthChecked } = useSelector((state) => state.user);

  const [updateKey, setUpdateKey] = useState(0);
  const handleUpdate = () => {
    setUpdateKey((prev) => prev++);
  };

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      handleUpdate();
    }
  }, [user, updateKey]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isUserLoading) return;
    const newUserData: Partial<TRegisterData> = {};
    if (formValue.name !== user?.name) newUserData.name = formValue.name;
    if (formValue.email !== user?.email) newUserData.email = formValue.email;
    if (formValue.password) newUserData.password = formValue.password;

    dispatch(updateUser(newUserData))
      .unwrap()
      .then(() => {
        handleUpdate();
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (!isAuthChecked) return <Preloader />;

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
