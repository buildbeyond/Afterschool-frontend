import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types';

import Messages from './pages/Messages';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import LandingPage from './pages/Pages/LandingPage';
import ScheduleInput from './pages/Schedule/ScheduleInput';
import ScheduleStats from './pages/Schedule/ScheduleStatistics';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Unauthorized from './pages/Authentication/Unauthorized';

function AppContent() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const {
    isAuthenticated,
    loading: authLoading,
    initializeAuth,
    user,
  } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      await initializeAuth();
      setTimeout(() => setLoading(false), 1000);
    };
    initAuth();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (authLoading) {
    return <Loader />;
  }

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route
        path="/auth/signin"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role == 'parent' ? '/schedule/input' : '/schedule/stats'
              }
            />
          ) : (
            <SignIn />
          )
        }
      />
      <Route
        path="/auth/signup"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role == 'parent' ? '/schedule/input' : '/schedule/stats'
              }
            />
          ) : (
            <SignUp />
          )
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        index
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role == 'parent' ? '/schedule/input' : '/schedule/stats'
              }
            />
          ) : (
            <>
              <PageTitle title="After School" />
              <LandingPage />
            </>
          )
        }
      />
      <Route
        path="/schedule/input"
        element={
          <RoleProtectedRoute allowedRoles={[UserRole.PARENT]}>
            <PageTitle title="Schedule Input" />
            <ScheduleInput />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/schedule/stats"
        element={
          <RoleProtectedRoute allowedRoles={[UserRole.COACH]}>
            <PageTitle title="Schedule Statistics" />
            <ScheduleStats />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <PageTitle title="Messages" />
            <Messages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
