import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, WEEK_DAYS } from '../../constants';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Separator } from '../../components/ui/separator';

export default function DriverRecurringRidesPage() {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('2');
  const [pricePerSeat, setPricePerSeat] = useState('50');

  // Función para manejar la selección de días
  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para guardar el viaje recurrente
    console.log({
      selectedDays,
      startLocation,
      endLocation,
      departureTime,
      availableSeats,
      pricePerSeat
    });
    
    // Redirigir al conductor a su página principal
    navigate(ROUTES.DRIVER.HOME);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(ROUTES.DRIVER.HOME)}
          className="mr-2"
        >
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold">Configurar Viaje Recurrente</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Viaje</CardTitle>
              <CardDescription>
                Configura los detalles de tu viaje recurrente para compartirlo con pasajeros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startLocation">Punto de partida</Label>
                  <Input 
                    id="startLocation" 
                    placeholder="Ej. Mi casa, El Tipal" 
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endLocation">Destino</Label>
                  <Input 
                    id="endLocation" 
                    placeholder="Ej. Mi trabajo, Grand Bourg" 
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Hora de salida</Label>
                  <Input 
                    id="departureTime" 
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Días de la semana</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {WEEK_DAYS.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={day.id} 
                          checked={selectedDays.includes(day.id)}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <Label htmlFor={day.id}>{day.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableSeats">Asientos disponibles</Label>
                    <Input 
                      id="availableSeats" 
                      type="number" 
                      min="1" 
                      max="6"
                      value={availableSeats}
                      onChange={(e) => setAvailableSeats(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePerSeat">Precio por asiento ($)</Label>
                    <Input 
                      id="pricePerSeat" 
                      type="number" 
                      min="0"
                      value={pricePerSeat}
                      onChange={(e) => setPricePerSeat(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Guardar Viaje Recurrente</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Vista previa de la ruta</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="h-full bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-gray-500 mb-2">Mapa de la ruta</p>
                  <p className="text-sm">Ingresa los puntos de origen y destino para visualizar la ruta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
