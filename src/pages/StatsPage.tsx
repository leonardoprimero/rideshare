// Página de estadísticas para demostración
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { Button } from '../components/ui/button';
import { ROUTES } from '../constants';

const StatsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navegación */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(ROUTES.HOME)}
                className="flex items-center space-x-2"
              >
                <span>←</span>
                <span>Volver al Inicio</span>
              </Button>
              <div className="h-6 border-l border-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Estadísticas del Sistema</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">En tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        <Dashboard />
      </div>

      {/* Información adicional para inversionistas */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ShareRide - Movilidad Inteligente para Salta
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              Una solución tecnológica innovadora que conecta conductores y pasajeros en Salta, 
              optimizando la movilidad urbana mientras genera impacto económico y ambiental positivo.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Tecnología Avanzada</h3>
                <p className="text-sm text-blue-700">
                  Algoritmos de matching inteligente, sistema de pagos integrado y tracking en tiempo real.
                </p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Impacto Sostenible</h3>
                <p className="text-sm text-green-700">
                  Reducción del 35% en emisiones de CO₂ y optimización del uso de vehículos privados.
                </p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Modelo Escalable</h3>
                <p className="text-sm text-purple-700">
                  Arquitectura preparada para expansión a múltiples ciudades del NOA argentino.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
