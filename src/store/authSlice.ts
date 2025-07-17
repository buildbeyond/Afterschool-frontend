import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../types';
import { Parent } from '../components/Sidebar';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  parents: Parent[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  parents: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = { ...state.user, ...action.payload };
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setParents: (state, action: PayloadAction<Parent[]>) => {
      state.parents = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
