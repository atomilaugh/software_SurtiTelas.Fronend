import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Eye, EyeOff, Phone, CreditCard, Check } from 'lucide-react';
import { useAuth, TEST_ACCOUNTS } from '@/app/providers/AppProviders';
import { toast } from 'sonner';
import './AuthPage.css';

type Tab = 'login' | 'register';
type RoleId = 'admin' | 'asesor' | 'domiciliario' | 'cliente';

const ROLES: { id: RoleId; icon: React.ReactNode; label: string; desc: string; iconClass: string }[] = [
  { id: 'admin', icon: '⚙️', label: 'Administrador', desc: 'Acceso completo al sistema', iconClass: 'roleIcon--admin' },
  { id: 'asesor', icon: '💼', label: 'Asesor', desc: 'Gestión de clientes y ventas', iconClass: 'roleIcon--asesor' },
  { id: 'domiciliario', icon: '🚚', label: 'Domiciliario', desc: 'Gestión de entregas y rutas', iconClass: 'roleIcon--delivery' },
  { id: 'cliente', icon: '🛍️', label: 'Cliente', desc: 'Catálogo y seguimiento de pedidos', iconClass: 'roleIcon--cliente' },
];

function passwordStrength(pwd: string): null | 'weak' | 'fair' | 'strong' {
  if (!pwd) return null;
  const score = [/[a-z]/.test(pwd), /[A-Z]/.test(pwd), /\d/.test(pwd), /[^a-zA-Z0-9]/.test(pwd), pwd.length >= 8].filter(Boolean).length;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/catalogo';
  const { loginWithCredentials, clearReturnTo } = useAuth();

  const [tab, setTab] = useState<Tab>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [reg, setReg] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    password: '',
    confirm: '',
    role: 'cliente' as RoleId,
    terms: false,
  });

  const switchTab = (t: Tab) => { setTab(t); setErrors({}); setSuccess(false); };

  const validateLogin = (): boolean => {
    const e: Record<string, string> = {};
    if (!loginEmail) e.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) e.email = 'Email inválido';
    if (!loginPassword) e.password = 'La contraseña es obligatoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = (): boolean => {
    const e: Record<string, string> = {};
    if (!reg.firstName.trim()) e.firstName = 'Campo obligatorio';
    if (!reg.lastName.trim()) e.lastName = 'Campo obligatorio';
    if (!reg.email) e.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)) e.email = 'Email inválido';
    if (!reg.documentType.trim()) e.documentType = 'Campo obligatorio';
    if (!reg.documentNumber.trim()) e.documentNumber = 'Campo obligatorio';
    if (!reg.password) e.password = 'La contraseña es obligatoria';
    else if (reg.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (reg.password !== reg.confirm) e.confirm = 'Las contraseñas no coinciden';
    if (!reg.terms) e.terms = 'Debes aceptar los términos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const result = await loginWithCredentials(loginEmail.trim(), loginPassword);
      if (result.success) {
        clearReturnTo();
        setSuccess(true);
        toast.success('¡Sesión iniciada exitosamente!');
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } else {
        toast.error(result.error || 'Credenciales incorrectas');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const result = await loginWithCredentials(reg.email.trim(), reg.password);
      if (result.success) {
        setSuccess(true);
        toast.success('¡Cuenta creada exitosamente!');
        setTimeout(() => navigate(from, { replace: true }), 1000);
      } else {
        toast.error('No se pudo crear la cuenta. Use credenciales de prueba');
      }
    } finally {
      setLoading(false);
    }
  };

  const pwdStrength = passwordStrength(reg.password);

  return (
    <div className="authPage">
      {/* Left Panel - Branding */}
      <aside className="leftPanel">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="panelDivider" />

        <div className="leftLogo">
          <div className="leftLogoIcon">ST</div>
          <span className="leftLogoText">Surtitelas</span>
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
            <p className="formWelcome">{tab === 'login' ? 'Bienvenido de nuevo' : 'Únete ahora'}</p>
            <h2 className="formTitle">{tab === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
            <p className="formSubtitle">
              {tab === 'login' ? 'Accede al panel de gestión de tu empresa.' : 'Completa tu información y comienza en segundos.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="tabToggle">
            <button className={`tabBtn ${tab === 'login' ? 'tabBtn--active' : ''}`} onClick={() => switchTab('login')}>
              Iniciar sesión
            </button>
            <button className={`tabBtn ${tab === 'register' ? 'tabBtn--active' : ''}`} onClick={() => switchTab('register')}>
              Registrarse
            </button>
          </div>

          <div className="divider">
            <div className="dividerLine" />
            <span className="dividerText">o continúa con email</span>
            <div className="dividerLine" />
          </div>

          {/* Login Form */}
          {tab === 'login' && (
            <div className="formSlide">
              <div className="form">
                <div className="fieldWrap fieldWrap--icon">
                  <input
                    className={`fieldInput ${errors.email ? 'fieldInput--error' : ''}`}
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <label className="fieldLabel">Correo electrónico</label>
                  <span className="fieldIcon"><Mail size={16} /></span>
                  {errors.email && <span className="fieldError">{errors.email}</span>}
                </div>

                <div className="fieldWrap fieldWrap--icon">
                  <input
                    className={`fieldInput ${errors.password ? 'fieldInput--error' : ''}`}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <label className="fieldLabel">Contraseña</label>
                  <button className="fieldIcon" type="button" onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.password && <span className="fieldError">{errors.password}</span>}
                </div>

                <div className="formExtras">
                  <label className="checkboxWrap">
                    <input className="checkboxInput" type="checkbox" />
                    <div className="checkboxBox" />
                    <span className="checkboxLabel">Recordar sesión</span>
                  </label>
                  <a href="/olvide-contrasena" className="forgotLink">¿Olvidaste tu contraseña?</a>
                </div>

                <button className={`submitBtn ${loading ? 'submitBtn--loading' : ''}`} onClick={handleLogin} disabled={loading}>
                  <span className="btnInner">{loading && <span className="spinner" />}
                    {loading ? 'Verificando...' : 'Iniciar sesión'}
                  </span>
                </button>
              </div>

<div className="formFooter">
                ¿No tienes cuenta?{' '}
                <button className="switchLink" onClick={() => switchTab('register')}>Regístrate gratis</button>
              </div>
              <div className="auth-test-accounts">
                <p className="testAccountsLabel">Credenciales de prueba:</p>
                <div className="testAccountsGrid">
                  {TEST_ACCOUNTS.map(account => (
                    <button
                      key={account.email}
                      type="button"
                      className="testAccountBtn"
                      onClick={() => {
                        setLoginEmail(account.email);
                        setLoginPassword(account.password);
                      }}
                    >
                      {account.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <div className="formSlide">
              <div className="form">
                <div className="formRow">
                  <div className="fieldWrap">
                    <input
                      className={`fieldInput ${errors.firstName ? 'fieldInput--error' : ''}`}
                      type="text"
                      placeholder="Nombre"
                      value={reg.firstName}
                      onChange={e => setReg(p => ({ ...p, firstName: e.target.value }))}
                    />
                    <label className="fieldLabel">Nombre</label>
                    {errors.firstName && <span className="fieldError">{errors.firstName}</span>}
                  </div>
                  <div className="fieldWrap">
                    <input
                      className={`fieldInput ${errors.lastName ? 'fieldInput--error' : ''}`}
                      type="text"
                      placeholder="Apellido"
                      value={reg.lastName}
                      onChange={e => setReg(p => ({ ...p, lastName: e.target.value }))}
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
                    value={reg.email}
                    onChange={e => setReg(p => ({ ...p, email: e.target.value }))}
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
                      value={reg.phone}
                      onChange={e => setReg(p => ({ ...p, phone: e.target.value }))}
                    />
                    <label className="fieldLabel">Teléfono</label>
                    <span className="fieldIcon"><Phone size={16} /></span>
                  </div>
                  <div className="fieldWrap fieldWrap--icon">
                    <select
                      className={`fieldInput ${errors.documentType ? 'fieldInput--error' : ''}`}
                      value={reg.documentType}
                      onChange={e => setReg(p => ({ ...p, documentType: e.target.value }))}
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
                    value={reg.documentNumber}
                    onChange={e => setReg(p => ({ ...p, documentNumber: e.target.value }))}
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
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Contraseña"
                      value={reg.password}
                      onChange={e => setReg(p => ({ ...p, password: e.target.value }))}
                      autoComplete="new-password"
                    />
                    <label className="fieldLabel">Contraseña</label>
                    <button className="fieldIcon" type="button" onClick={() => setShowPwd(v => !v)}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    value={reg.confirm}
                    onChange={e => setReg(p => ({ ...p, confirm: e.target.value }))}
                    autoComplete="new-password"
                  />
                  <label className="fieldLabel">Confirmar contraseña</label>
                  <button className="fieldIcon" type="button" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.confirm && <span className="fieldError">{errors.confirm}</span>}
                </div>

                <div>
                  <p className="roleSectionLabel">Selecciona tu rol</p>
                  <div className="roleGrid">
                    {ROLES.map(role => (
                      <button
                        key={role.id}
                        type="button"
                        className={`roleOption ${reg.role === role.id ? 'roleOption--selected' : ''}`}
                        onClick={() => setReg(p => ({ ...p, role: role.id }))}
                      >
                        <div className="roleOptionCheck" />
                        <div className={`roleIcon ${role.iconClass}`}><span>{role.icon}</span></div>
                        <span className="roleLabel">{role.label}</span>
                        <span className="roleDesc">{role.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="checkboxWrap">
                    <input
                      className="checkboxInput"
                      type="checkbox"
                      checked={reg.terms}
                      onChange={e => setReg(p => ({ ...p, terms: e.target.checked }))}
                    />
                    <div className="checkboxBox" />
                    <span className="checkboxLabel">
                      Acepto los <a href="#" className="termsLink">Términos de servicio</a> y la{' '}
                      <a href="#" className="termsLink">Política de privacidad</a>
                    </span>
                  </label>
                  {errors.terms && <span className="fieldError" style={{ marginTop: 4, display: 'block' }}>{errors.terms}</span>}
                </div>

                <button className={`submitBtn ${loading ? 'submitBtn--loading' : ''}`} onClick={handleRegister} disabled={loading}>
                  <span className="btnInner">{loading && <span className="spinner" />}
                    {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
                  </span>
                </button>
              </div>

              <div className="formFooter">
                ¿Ya tienes cuenta?{' '}
                <button className="switchLink" onClick={() => switchTab('login')}>Inicia sesión</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {success && (
        <div className="successToast">
          <div className="toastIcon"><Check size={16} /></div>
          <div>
            <div className="toastTitle">{tab === 'login' ? '¡Sesión iniciada!' : '¡Cuenta creada!'}</div>
            <div className="toastDesc">Redirigiendo al panel...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
