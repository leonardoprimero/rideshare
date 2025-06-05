// Dashboard de estadísticas profesional para demostración
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { demoStats, monthlyData, weeklyUsageData } from '../data/demoStats';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num);
  };

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ShareRide Dashboard</h1>
        <p className="text-gray-600">Estadísticas en tiempo real - Salta, Argentina</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Usuarios Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(demoStats.platform.totalUsers)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <span className="mr-1">↗</span>
              +{demoStats.platform.monthlyGrowth}% este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conductores Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(demoStats.platform.activeDrivers)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              de {formatNumber(demoStats.platform.totalDrivers)} registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Viajes Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(demoStats.platform.completedRides)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Rating promedio: {demoStats.platform.averageRating}⭐
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ingresos Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(demoStats.financial.monthlyRevenue)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <span className="mr-1">↗</span>
              +{demoStats.financial.revenueGrowth}% crecimiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de Salta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Salta</CardTitle>
            <CardDescription>Rendimiento en nuestra ciudad principal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Usuarios Registrados</span>
              <Badge variant="outline">{formatNumber(demoStats.salta.registeredUsers)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Viajes Diarios</span>
              <Badge variant="outline">{formatNumber(demoStats.salta.dailyRides)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tiempo de Espera Promedio</span>
              <Badge variant="outline">{demoStats.salta.averageWaitTime} min</Badge>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Penetración de Mercado</span>
                <span className="text-sm">{(demoStats.market.currentPenetration * 100).toFixed(1)}%</span>
              </div>
              <Progress value={demoStats.market.currentPenetration * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rutas Populares</CardTitle>
            <CardDescription>Las rutas más solicitadas en Salta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoStats.salta.popularRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{route.from} → {route.to}</p>
                  </div>
                  <Badge variant="secondary">{route.rides} viajes</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crecimiento mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Crecimiento Mensual</CardTitle>
          <CardDescription>Evolución de usuarios, viajes e ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyData.slice(-3).map((month, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-3">{month.month}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Usuarios:</span>
                    <span className="font-medium">{formatNumber(month.users)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Viajes:</span>
                    <span className="font-medium">{formatNumber(month.rides)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ingresos:</span>
                    <span className="font-medium">{formatCurrency(month.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uso semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Uso Semanal</CardTitle>
          <CardDescription>Distribución de viajes por día de la semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyUsageData.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">{day.day}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Viajes: {day.rides}</span>
                    <span className="text-xs text-gray-600">Conductores: {day.drivers}</span>
                  </div>
                  <Progress value={(day.rides / 225) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proyecciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proyecciones Q4 2024</CardTitle>
            <CardDescription>Objetivos para fin de año</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Usuarios Objetivo</span>
              <Badge variant="outline">{formatNumber(demoStats.projections.yearEnd.totalUsers)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Conductores Objetivo</span>
              <Badge variant="outline">{formatNumber(demoStats.projections.yearEnd.totalDrivers)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Viajes Mensuales</span>
              <Badge variant="outline">{formatNumber(demoStats.projections.yearEnd.monthlyRides)}</Badge>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Cuota de Mercado Objetivo</span>
                <span className="text-sm">{demoStats.projections.yearEnd.marketShare}%</span>
              </div>
              <Progress value={demoStats.projections.yearEnd.marketShare} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impacto Ambiental</CardTitle>
            <CardDescription>Beneficios sostenibles de ShareRide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">CO₂ Reducido (mensual)</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {formatNumber(demoStats.impact.co2Reduction)} kg
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Viajes Compartidos</span>
              <Badge variant="outline">{demoStats.impact.sharedRidesPercentage}%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ocupación Promedio</span>
              <Badge variant="outline">{demoStats.impact.averageOccupancy} personas</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">KM Vacíos Reducidos</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {formatNumber(demoStats.impact.emptyKilometersReduced)} km
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer con información de contacto */}
      <div className="text-center pt-8 border-t">
        <p className="text-sm text-gray-600">
          ShareRide Salta • Datos actualizados en tiempo real • 
          <span className="text-green-600 ml-1">Sistema operativo al {demoStats.operations.systemUptime}%</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
