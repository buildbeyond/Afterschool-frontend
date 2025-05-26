import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

import Messages from './pages/Messages';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ScheduleInput from './pages/Schedule/ScheduleInput';
import ScheduleStats from './pages/Schedule/ScheduleStatistics';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Unauthorized from './pages/Authentication/Unauthorized';
import Profile from './pages/Profile';
import ScheduleIndividual from './pages/Schedule/ScheduleIndividual';

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
            <Navigate to={'/auth/signin'} />
          )
        }
      />
      <Route
        path="/schedule/input"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <PageTitle title="Schedule Input" />
            <ScheduleInput />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule/stats"
        element={
          <ProtectedRoute allowedRoles={['coach']}>
            <PageTitle title="Schedule Statistics" />
            <ScheduleStats />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule/:userId"
        element={
          <ProtectedRoute allowedRoles={['coach']}>
            <PageTitle title="Individual Schedule" />
            <ScheduleIndividual />
          </ProtectedRoute>
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
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PageTitle title="Profile" />
            <Profile />
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
