import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ROUTES } from '../constants';
import '../styles/RegisterPage.css';
import { useAuth } from '../hooks/useAuth'; // Added useAuth
import { UIRegisterData } from '../store/slices/authSlice'; // For payload type

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error: authError, clearError: clearAuthError } = useAuth(); // useAuth hook
  const [activeTab, setActiveTab] = useState<string>('passenger');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    carModel: '',
    carYear: '',
    licensePlate: '',
    driverLicense: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [isSubmitting, setIsSubmitting] = useState(false); // Replaced by isLoading from useAuth

  // Clear auth error on component mount or when authError changes but there's no new submission
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  // Display authError if it exists
  useEffect(() => {
    if (authError) {
      setErrors(prev => ({ ...prev, form: authError }));
    }
  }, [authError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (errors.form) setErrors({ ...errors, form: '' }); // Clear form-level error on input change
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El formato de email no es válido';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'El teléfono debe tener 10 dígitos';
    
    if (activeTab === 'driver') {
      if (!formData.carModel.trim()) newErrors.carModel = 'El modelo del vehículo es obligatorio';
      if (!formData.carYear.trim()) newErrors.carYear = 'El año del vehículo es obligatorio';
      else if (!/^\d{4}$/.test(formData.carYear) || parseInt(formData.carYear) < 2000) newErrors.carYear = 'Ingrese un año válido (desde 2000)';
      if (!formData.licensePlate.trim()) newErrors.licensePlate = 'La matrícula es obligatoria';
      if (!formData.driverLicense.trim()) newErrors.driverLicense = 'La licencia de conducir es obligatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError(); // Clear previous errors
    if (validateForm()) {
      const payload: UIRegisterData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone, // Kept for UI, authSlice maps to backend DTO
        isDriver: activeTab === 'driver',
      };
      
      // Driver specific fields are not part of UIRegisterData for backend registration payload
      // If they need to be sent, the backend DTO and service calls must be updated.
      // For now, they are collected by form but not sent by this payload.

      const result = await register(payload);

      if (result.meta.requestStatus === 'fulfilled') {
        // Handle success - e.g., show message, redirect to login
        // For now, simple alert and redirect to login
        alert('Registro exitoso. Por favor, inicia sesión.'); // Replace with better UX
        navigate(ROUTES.LOGIN);
      } else if (result.meta.requestStatus === 'rejected') {
        // Error message is in result.payload
        setErrors({ form: result.payload as string || 'Error en el registro.' });
      }
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setErrors({});
    clearAuthError(); // Clear error when tab changes
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <CardHeader>
          <CardTitle>Crear una cuenta</CardTitle>
          <CardDescription>Regístrate para comenzar a usar RideShare</CardDescription>
        </CardHeader>
        
        {errors.form && <div className="form-error-message general-error">{errors.form}</div>}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="register-tabs">
          <TabsList className="tabs-list">
            <TabsTrigger value="passenger">Pasajero</TabsTrigger>
            <TabsTrigger value="driver">Conductor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="passenger">
            <form onSubmit={handleSubmit}>
              <CardContent className="register-form">
                {/* Fields remain the same, ensure name attributes match formData keys */}
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="firstNameP">Nombre</Label>
                    <Input id="firstNameP" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ingresa tu nombre" className={errors.firstName ? 'error' : ''} />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-field">
                    <Label htmlFor="lastNameP">Apellido</Label>
                    <Input id="lastNameP" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Ingresa tu apellido" className={errors.lastName ? 'error' : ''} />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <Label htmlFor="emailP">Email</Label>
                  <Input id="emailP" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" className={errors.email ? 'error' : ''} />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="passwordP">Contraseña</Label>
                    <Input id="passwordP" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Contraseña" className={errors.password ? 'error' : ''} />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  <div className="form-field">
                    <Label htmlFor="confirmPasswordP">Confirmar contraseña</Label>
                    <Input id="confirmPasswordP" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirma tu contraseña" className={errors.confirmPassword ? 'error' : ''} />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <Label htmlFor="phoneP">Teléfono</Label>
                  <Input id="phoneP" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ingresa tu número de teléfono" className={errors.phone ? 'error' : ''} />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="register-button" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrarse como pasajero'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="driver">
            <form onSubmit={handleSubmit}>
              <CardContent className="register-form">
                {/* Common fields */}
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="firstNameD">Nombre</Label>
                    <Input id="firstNameD" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ingresa tu nombre" className={errors.firstName ? 'error' : ''} />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-field">
                    <Label htmlFor="lastNameD">Apellido</Label>
                    <Input id="lastNameD" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Ingresa tu apellido" className={errors.lastName ? 'error' : ''} />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <Label htmlFor="emailD">Email</Label>
                  <Input id="emailD" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" className={errors.email ? 'error' : ''} />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <Label htmlFor="passwordD">Contraseña</Label>
                    <Input id="passwordD" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Contraseña" className={errors.password ? 'error' : ''} />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>
                  <div className="form-field">
                    <Label htmlFor="confirmPasswordD">Confirmar contraseña</Label>
                    <Input id="confirmPasswordD" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirma tu contraseña" className={errors.confirmPassword ? 'error' : ''} />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <Label htmlFor="phoneD">Teléfono</Label>
                  <Input id="phoneD" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ingresa tu número de teléfono" className={errors.phone ? 'error' : ''} />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                {/* Driver specific fields */}
                <div className="driver-section">
                  <h3 className="section-title">Información del vehículo</h3>
                  <div className="form-row">
                    <div className="form-field">
                      <Label htmlFor="carModel">Modelo del vehículo</Label>
                      <Input id="carModel" name="carModel" value={formData.carModel} onChange={handleInputChange} placeholder="Ej. Toyota Corolla" className={errors.carModel ? 'error' : ''} />
                      {errors.carModel && <span className="error-message">{errors.carModel}</span>}
                    </div>
                    <div className="form-field">
                      <Label htmlFor="carYear">Año</Label>
                      <Input id="carYear" name="carYear" value={formData.carYear} onChange={handleInputChange} placeholder="Ej. 2020" className={errors.carYear ? 'error' : ''} />
                      {errors.carYear && <span className="error-message">{errors.carYear}</span>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <Label htmlFor="licensePlate">Matrícula</Label>
                      <Input id="licensePlate" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} placeholder="Ej. ABC123" className={errors.licensePlate ? 'error' : ''} />
                      {errors.licensePlate && <span className="error-message">{errors.licensePlate}</span>}
                    </div>
                    <div className="form-field">
                      <Label htmlFor="driverLicense">Licencia de conducir</Label>
                      <Input id="driverLicense" name="driverLicense" value={formData.driverLicense} onChange={handleInputChange} placeholder="Número de licencia" className={errors.driverLicense ? 'error' : ''} />
                      {errors.driverLicense && <span className="error-message">{errors.driverLicense}</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="register-button" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrarse como conductor'}
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
