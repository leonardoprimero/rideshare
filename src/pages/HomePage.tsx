import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-container">
          <h1>RideShare</h1>
          <p className="tagline">Viajes compartidos a un clic de distancia</p>
        </div>
        <div className="auth-buttons">
          <Link to={ROUTES.LOGIN} className="login-button">Iniciar Sesión</Link>
          <Link to={ROUTES.REGISTER} className="register-button">Registrarse</Link>
        </div>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2>Tu viaje, tu elección</h2>
            <p>RideShare combina lo mejor de Uber y BlaBlaCar en una sola plataforma</p>
            <div className="hero-buttons">
              <Link to={ROUTES.PASSENGER.HOME} className="passenger-button">Viajar como pasajero</Link>
              <Link to={ROUTES.DRIVER.HOME} className="driver-button">Conducir</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <span className="car-icon">🚗</span>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>¿Por qué elegir RideShare?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚕</div>
              <h3>Viajes inmediatos</h3>
              <p>Solicita un conductor que te recoja y te lleve a tu destino al instante</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Viajes recurrentes</h3>
              <p>Comparte tu ruta diaria al trabajo o escuela y ahorra en cada trayecto</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Viajes compartidos</h3>
              <p>Encuentra personas que realizan el mismo trayecto que tú</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Precios justos</h3>
              <p>Tarifas transparentes y opciones para todos los presupuestos</p>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <h2>¿Cómo funciona?</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta en segundos y configura tu perfil</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Elige tu rol</h3>
              <p>Decide si quieres viajar como pasajero o conductor</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>¡Listo!</h3>
              <p>Solicita un viaje o acepta pasajeros según tu elección</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>RideShare</h2>
            <p>© 2025 RideShare. Todos los derechos reservados made for Leonardo I. <a href="https://www.leocaliva.com" target="_blank" rel="noopener noreferrer" style={{color: '#4361ee', textDecoration: 'none'}}>www.leocaliva.com</a></p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h3>Empresa</h3>
              <a href="#">Sobre nosotros</a>
              <a href="#">Cómo funciona</a>
              <Link to={ROUTES.STATS}>Estadísticas</Link>
              <a href="#">Contacto</a>
            </div>
            <div className="link-group">
              <h3>Legal</h3>
              <a href="#">Términos y condiciones</a>
              <a href="#">Privacidad</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
