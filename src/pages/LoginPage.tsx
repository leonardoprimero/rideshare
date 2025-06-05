import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/ui/loading';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    clearError();
    
    try {
      const result = await login(email, password);
      if (result.meta?.requestStatus === 'fulfilled') {
        // Determinar la página de destino según el tipo de usuario
        const payload = result.payload as any;
        const user = payload.user;
        if (user?.isDriver) {
          navigate(ROUTES.DRIVER.HOME);
        } else {
          navigate(ROUTES.PASSENGER.HOME);
        }
      }
    } catch (err: any) {
      console.error('Error en login:', err);
    }
  };

  const handleDemoLogin = async (userType: 'passenger' | 'driver') => {
    clearError();
    
    const demoCredentials = {
      passenger: { email: 'maria.gonzalez@email.com', password: 'demo' },
      driver: { email: 'carlos.roberto.fernández@shareride.com', password: 'demo' }
    };
    
    const credentials = demoCredentials[userType];
    setEmail(credentials.email);
    setPassword(credentials.password);
    
    try {
      const result = await login(credentials.email, credentials.password);
      if (result.meta?.requestStatus === 'fulfilled') {
        if (userType === 'driver') {
          navigate(ROUTES.DRIVER.HOME);
        } else {
          navigate(ROUTES.PASSENGER.HOME);
        }
      }
    } catch (err: any) {
      console.error('Error en login demo:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>RideShare</h1>
          <h2>Iniciar Sesión</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? <Loading size="sm" /> : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Botones de demostración */}
        <div className="demo-section">
          <div className="demo-divider">
            <span>O prueba la demostración</span>
          </div>
          
          <div className="demo-buttons">
            <button 
              type="button"
              className="demo-button passenger"
              onClick={() => handleDemoLogin('passenger')}
              disabled={isLoading}
            >
              {isLoading ? <Loading size="sm" /> : (
                <>
                  <span className="demo-icon">👤</span>
                  <span>Entrar como Pasajero</span>
                </>
              )}
            </button>
            
            <button 
              type="button"
              className="demo-button driver"
              onClick={() => handleDemoLogin('driver')}
              disabled={isLoading}
            >
              {isLoading ? <Loading size="sm" /> : (
                <>
                  <span className="demo-icon">🚗</span>
                  <span>Entrar como Conductor</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="register-prompt">
          ¿No tienes una cuenta? <a href={ROUTES.REGISTER}>Regístrate</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
