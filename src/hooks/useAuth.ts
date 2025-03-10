import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { authApi } from '../services/api';
import { setUser, clearUser, setLoading } from '../store/authSlice';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ILoginInput, IRegisterInput } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const initializeAuth = async () => {
    try {
      dispatch(setLoading(true));
      const token = Cookies.get('token');
      if (token) {
        const response = await authApi.getCurrentUser();
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      Cookies.remove('token');
      dispatch(clearUser());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (data: ILoginInput) => {
    try {
      const response = await authApi.login(data);
      const { user, token } = response.data;
      Cookies.set('token', token);
      dispatch(setUser(user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'ログインに失敗しました',
      };
    }
  };

  const register = async (data: IRegisterInput) => {
    try {
      const response = await authApi.register(data);
      const { user, token } = response.data;
      Cookies.set('token', token);
      dispatch(setUser(user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    authApi.logout();
    dispatch(clearUser());
    navigate('/auth/signin');
  };

  return {
    ...auth,
    login,
    register,
    logout,
    initializeAuth,
  };
};
