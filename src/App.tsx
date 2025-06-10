import React, { useEffect } from 'react'; // Added useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ROUTES } from './constants';
import { useAuth } from './hooks/useAuth'; // Added

// Importación de páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PassengerHomePage from './pages/passenger/PassengerHomePage';
import SearchDestinationPage from './pages/passenger/SearchDestinationPage';
import RideRequestPage from './pages/passenger/RideRequestPage';
import RideTrackingPage from './pages/passenger/RideTrackingPage';
import SharedRidesPage from './pages/passenger/SharedRidesPage';
import DriverHomePage from './pages/driver/DriverHomePage';
import DriverRecurringRidesPage from './pages/driver/DriverRecurringRidesPage';
import ProfilePage from './pages/ProfilePage';
import StatsPage from './pages/StatsPage';

import './App.css';

function App() {
  const { initializeAuth } = useAuth(); // Added

  useEffect(() => { // Added
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Rutas públicas */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.STATS} element={<StatsPage />} />
            
            {/* Rutas de pasajero */}
            <Route path={ROUTES.PASSENGER.HOME} element={<PassengerHomePage />} />
            <Route path={ROUTES.PASSENGER.SEARCH_DESTINATION} element={<SearchDestinationPage />} />
            <Route path={ROUTES.PASSENGER.RIDE_REQUEST} element={<RideRequestPage />} />
            <Route path={ROUTES.PASSENGER.RIDE_TRACKING} element={<RideTrackingPage />} />
            <Route path={ROUTES.PASSENGER.SHARED_RIDES} element={<SharedRidesPage />} />
            
            {/* Rutas de conductor */}
            <Route path={ROUTES.DRIVER.HOME} element={<DriverHomePage />} />
            <Route path={ROUTES.DRIVER.RECURRING_RIDES} element={<DriverRecurringRidesPage />} />
            
            {/* Rutas comunes */}
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
