import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Eye, EyeOff, Phone, CreditCard, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/providers/AppProviders';
import { toast } from 'sonner';
import partnerLogo from '@/assets/images/logos/partner-logo-2-Photoroom.png';
import './AuthPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = (pwd: string): null | 'weak' | 'fair' | 'strong' => {
    if (!pwd) return null;
    const score = [/[a-z]/.test(pwd), /[A-Z]/.test(pwd), /\d/.test(pwd), /[^a-zA-Z0-9]/.test(pwd), pwd.length >= 8].filter(Boolean).length;
    if (score <= 2) return 'weak';
    if (score <= 3) return 'fair';
    return 'strong';
  };

  const validateRegister = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'Campo obligatorio';
    if (!lastName.trim()) e.lastName = 'Campo obligatorio';
    if (!email) e.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email inválido';
    if (!documentType.trim()) e.documentType = 'Campo obligatorio';
    if (!documentNumber.trim()) e.documentNumber = 'Campo obligatorio';
    if (!password) e.password = 'La contraseña es obligatoria';
    else if (password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (password !== confirmPassword) e.confirm = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const result = await loginWithCredentials(email.trim(), password);
      if (result.success) {
        setSuccess(true);
        toast.success('¡Cuenta creada exitosamente!');
        setTimeout(() => navigate('/cliente/inicio', { replace: true }), 1000);
      } else {
        toast.error('No se pudo crear la cuenta. Use credenciales de prueba');
      }
    } catch {
      toast.error('No se pudo crear la cuenta. Revise los datos');
    } finally {
      setLoading(false);
    }
  };

const pwdStrength = passwordStrength(password);

   return (
    <div className="authPage">
      {/* Left Panel - Branding */}
      <aside className="leftPanel">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="panelDivider" />

        <div className="leftLogo">
          <button
            type="button"
            className="auth-back-btn"
            onClick={() => navigate('/')}
            aria-label="Volver al inicio"
          >
            <ArrowLeft size={16} />
            <span>Volver al inicio</span>
          </button>
          <img src={partnerLogo} alt="Surtitelas" className="partnerLogo" />
        </div>

        <div className="leftContent">
          <p className="leftTagline">Plataforma de gestión</p>
          <h1 className="leftHeading">
            Controla tu negocio<br />con <em>precisión</em><br />y elegancia
          </h1>
          <p className="leftDesc">
            Gestiona ventas, producción e inventario desde un solo lugar.
            Diseñado para empresas de confección que quieren crecer sin perder el control.
          </p>
          <div className="metricsRow">
            <div className="metric">
              <div className="metricValue">1.2<span>+</span></div>
              <div className="metricLabel">Clientes activos</div>
            </div>
            <div className="metricDivider" />
            <div className="metric">
              <div className="metricValue">98<span>%</span></div>
              <div className="metricLabel">Satisfacción</div>
            </div>
            <div className="metricDivider" />
            <div className="metric">
              <div className="metricValue">$48<span>M</span></div>
              <div className="metricLabel">Ventas gestionadas</div>
            </div>
          </div>
        </div>

        <div className="testimonial">
          <p className="testimonialQuote">
            Desde que implementamos Surtitelas, redujimos errores de inventario un 80% y duplicamos la velocidad de despacho.
          </p>
          <div className="testimonialAuthor">
            <div className="testimonialAvatar">MR</div>
            <div>
              <div className="testimonialName">María Rodríguez</div>
              <div className="testimonialRole">Gerente — Confecciones Andina</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Panel - Form */}
      <main className="rightPanel">
        <div className="formCard">
          <div className="mobileLogo">
            <div className="mobileLogoIcon">ST</div>
            <span className="mobileLogoText">Surtitelas</span>
          </div>

<div className="formHeader">
             <p className="formWelcome">Únete ahora</p>
             <h2 className="formTitle">Crea tu cuenta</h2>
             <p className="formSubtitle">Completa tu información y comienza en segundos.</p>
           </div>

           <div className="tabToggle">
             <button className="tabBtn" onClick={() => navigate('/login')}>Iniciar sesión</button>
             <button className="tabBtn tabBtn--active">Registrarse</button>
           </div>

           <div className="form">
            <div className="formRow">
              <div className="fieldWrap">
                <input
                  className={`fieldInput ${errors.firstName ? 'fieldInput--error' : ''}`}
                  type="text"
                  placeholder="Nombre"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
                <label className="fieldLabel">Nombre</label>
                {errors.firstName && <span className="fieldError">{errors.firstName}</span>}
              </div>
              <div className="fieldWrap">
                <input
                  className={`fieldInput ${errors.lastName ? 'fieldInput--error' : ''}`}
                  type="text"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
                <label className="fieldLabel">Apellido</label>
                {errors.lastName && <span className="fieldError">{errors.lastName}</span>}
              </div>
            </div>

            <div className="fieldWrap fieldWrap--icon">
              <input
                className={`fieldInput ${errors.email ? 'fieldInput--error' : ''}`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
              <label className="fieldLabel">Correo electrónico</label>
              <span className="fieldIcon"><Mail size={16} /></span>
              {errors.email && <span className="fieldError">{errors.email}</span>}
            </div>

<div className="formRow">
               <div className="fieldWrap fieldWrap--icon">
                 <input
                   className="fieldInput"
                   type="tel"
                   placeholder="Teléfono"
                   value={phone}
                   onChange={e => setPhone(e.target.value)}
                 />
                 <label className="fieldLabel">Teléfono</label>
                 <span className="fieldIcon"><Phone size={16} /></span>
               </div>
               <div className="fieldWrap fieldWrap--icon">
                 <select
                   className={`fieldInput ${errors.documentType ? 'fieldInput--error' : ''}`}
                   value={documentType}
                   onChange={e => setDocumentType(e.target.value)}
                 >
                   <option value="">Selecciona tipo</option>
                   <option value="CC">Cédula de Ciudadanía</option>
                   <option value="NIT">NIT</option>
                   <option value="Pasaporte">Pasaporte</option>
                   <option value="CE">Cédula de Extranjería</option>
                 </select>
                 <label className="fieldLabel">Tipo de documento</label>
                 <span className="fieldIcon"><CreditCard size={16} /></span>
                 {errors.documentType && <span className="fieldError">{errors.documentType}</span>}
               </div>
             </div>

             <div className="fieldWrap fieldWrap--icon">
               <input
                 className={`fieldInput ${errors.documentNumber ? 'fieldInput--error' : ''}`}
                 type="text"
                 placeholder="Ej: 1023456789"
                 value={documentNumber}
                 onChange={e => setDocumentNumber(e.target.value)}
                 maxLength="20"
               />
               <label className="fieldLabel">Número de documento</label>
               <span className="fieldIcon"><CreditCard size={16} /></span>
               {errors.documentNumber && <span className="fieldError">{errors.documentNumber}</span>}
             </div>

            <div>
              <div className="fieldWrap fieldWrap--icon">
                <input
                  className={`fieldInput ${errors.password ? 'fieldInput--error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <label className="fieldLabel">Contraseña</label>
                <button className="fieldIcon" type="button" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && <span className="fieldError">{errors.password}</span>}
              </div>
              {pwdStrength && (
                <div className="passwordStrength">
                  <div className="strengthTrack">
                    <div className={`strengthFill strengthFill--${pwdStrength}`} />
                  </div>
                  <span className={`strengthLabel strengthLabel--${pwdStrength}`}>
                    {pwdStrength === 'weak' && 'Contraseña débil'}
                    {pwdStrength === 'fair' && 'Contraseña moderada'}
                    {pwdStrength === 'strong' && 'Contraseña fuerte ✓'}
                  </span>
                </div>
              )}
            </div>

            <div className="fieldWrap fieldWrap--icon">
              <input
                className={`fieldInput ${errors.confirm ? 'fieldInput--error' : ''}`}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirmar"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <label className="fieldLabel">Confirmar contraseña</label>
              <button className="fieldIcon" type="button" onClick={() => setShowConfirm(v => !v)}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.confirm && <span className="fieldError">{errors.confirm}</span>}
            </div>

            <button className={`submitBtn ${loading ? 'submitBtn--loading' : ''}`} onClick={handleRegister} disabled={loading}>
              <span className="btnInner">{loading && <span className="spinner" />}
                {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
              </span>
            </button>
          </div>

          <div className="formFooter">
            ¿Ya tienes cuenta?{' '}
            <button className="switchLink" onClick={() => navigate('/login')}>Inicia sesión</button>
          </div>
        </div>
      </main>

      {success && (
        <div className="successToast">
          <div className="toastIcon"><User size={16} /></div>
          <div>
            <div className="toastTitle">¡Cuenta creada!</div>
            <div className="toastDesc">Redirigiendo al panel...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;