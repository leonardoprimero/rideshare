import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ROUTES } from '../constants';
import '../styles/RegisterPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('passenger');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Campos específicos para conductores
    carModel: '',
    carYear: '',
    licensePlate: '',
    driverLicense: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validaciones básicas
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato de email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }
    
    // Validaciones específicas para conductores
    if (activeTab === 'driver') {
      if (!formData.carModel.trim()) newErrors.carModel = 'El modelo del vehículo es obligatorio';
      if (!formData.carYear.trim()) {
        newErrors.carYear = 'El año del vehículo es obligatorio';
      } else if (!/^\d{4}$/.test(formData.carYear) || parseInt(formData.carYear) < 2000) {
        newErrors.carYear = 'Ingrese un año válido (desde 2000)';
      }
      if (!formData.licensePlate.trim()) newErrors.licensePlate = 'La matrícula es obligatoria';
      if (!formData.driverLicense.trim()) newErrors.driverLicense = 'La licencia de conducir es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulamos el registro (en una implementación real, enviaríamos los datos al backend)
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Redirigir según el tipo de usuario
        if (activeTab === 'passenger') {
          navigate(ROUTES.PASSENGER.HOME);
        } else {
          navigate(ROUTES.DRIVER.HOME);
        }
      }, 1500);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Limpiar errores al cambiar de tab
    setErrors({});
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <CardHeader>
          <CardTitle>Crear una cuenta</CardTitle>
          <CardDescription>
            Regístrate para comenzar a usar RideShare
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="register-tabs">
          <TabsList className="tabs-list">
            <TabsTrigger value="passenger">Pasajero</TabsTrigger>
            <TabsTrigger value="driver">Conductor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="passenger">
            <form onSubmit={handleSubmit}>
              <CardContent className="register-form">
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-field">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu apellido"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                
                <div className="form-field">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Contraseña"
                      className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  
                  <div className="form-field">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirma tu contraseña"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>
                
                <div className="form-field">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu número de teléfono"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="register-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Registrando...' : 'Registrarse como pasajero'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="driver">
            <form onSubmit={handleSubmit}>
              <CardContent className="register-form">
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-field">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu apellido"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                
                <div className="form-field">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Contraseña"
                      className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  
                  <div className="form-field">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirma tu contraseña"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>
                
                <div className="form-field">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu número de teléfono"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                
                <div className="driver-section">
                  <h3 className="section-title">Información del vehículo</h3>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <Label htmlFor="carModel">Modelo del vehículo</Label>
                      <Input
                        id="carModel"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleInputChange}
                        placeholder="Ej. Toyota Corolla"
                        className={errors.carModel ? 'error' : ''}
                      />
                      {errors.carModel && <span className="error-message">{errors.carModel}</span>}
                    </div>
                    
                    <div className="form-field">
                      <Label htmlFor="carYear">Año</Label>
                      <Input
                        id="carYear"
                        name="carYear"
                        value={formData.carYear}
                        onChange={handleInputChange}
                        placeholder="Ej. 2020"
                        className={errors.carYear ? 'error' : ''}
                      />
                      {errors.carYear && <span className="error-message">{errors.carYear}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <Label htmlFor="licensePlate">Matrícula</Label>
                      <Input
                        id="licensePlate"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        placeholder="Ej. ABC123"
                        className={errors.licensePlate ? 'error' : ''}
                      />
                      {errors.licensePlate && <span className="error-message">{errors.licensePlate}</span>}
                    </div>
                    
                    <div className="form-field">
                      <Label htmlFor="driverLicense">Licencia de conducir</Label>
                      <Input
                        id="driverLicense"
                        name="driverLicense"
                        value={formData.driverLicense}
                        onChange={handleInputChange}
                        placeholder="Número de licencia"
                        className={errors.driverLicense ? 'error' : ''}
                      />
                      {errors.driverLicense && <span className="error-message">{errors.driverLicense}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="register-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Registrando...' : 'Registrarse como conductor'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="login-link">
          ¿Ya tienes una cuenta? <a href={ROUTES.LOGIN}>Iniciar sesión</a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
