import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth, TEST_ACCOUNTS } from '@/app/providers/AppProviders';
import { toast } from 'sonner';
import partnerLogo from '@/assets/images/logos/partner-logo-2-Photoroom.png';
import './AuthPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, clearReturnTo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getDashboardByRole = (role: string | undefined): string => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'asesor') return '/asesor/dashboard';
    if (role === 'domiciliario') return '/domiciliario/dashboard';
    return '/cliente/inicio';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginWithCredentials(email.trim(), password);

    if (result.success) {
      clearReturnTo();
      toast.success('¡Sesión iniciada exitosamente!');
      const destination = getDashboardByRole(result.role);
      setTimeout(() => navigate(destination, { replace: true }), 800);
    } else {
      toast.error(result.error || 'Credenciales incorrectas');
    }

    setLoading(false);
  };

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
            <p className="formWelcome">Bienvenido de nuevo</p>
            <h2 className="formTitle">Inicia sesión</h2>
            <p className="formSubtitle">Accede al panel de gestión de tu empresa.</p>
          </div>

          <div className="tabToggle">
            <button className="tabBtn tabBtn--active">Iniciar sesión</button>
            <button className="tabBtn" onClick={() => navigate('/registro')}>Registrarse</button>
          </div>

          <div className="divider">
            <div className="dividerLine" />
            <span className="dividerText">o continúa con email</span>
            <div className="dividerLine" />
          </div>

          <div className="form">
            <div className="fieldWrap fieldWrap--icon">
              <input
                className="fieldInput"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
              <label className="fieldLabel">Correo electrónico</label>
              <span className="fieldIcon"><Mail size={16} /></span>
            </div>

            <div className="fieldWrap fieldWrap--icon">
              <input
                className="fieldInput"
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <label className="fieldLabel">Contraseña</label>
              <button className="fieldIcon" type="button" onClick={() => setShowPass(v => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
            <button className="switchLink" onClick={() => navigate('/registro')}>Regístrate gratis</button>
          </div>

          {/* Test accounts */}
          <div className="auth-test-accounts">
            <p className="testAccountsLabel">Credenciales de prueba:</p>
            <div className="testAccountsGrid">
              {TEST_ACCOUNTS.map(account => (
                <button
                  key={account.email}
                  type="button"
                  className="testAccountBtn"
                  onClick={() => { setEmail(account.email); setPassword(account.password); }}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {success && (
        <div className="successToast">
          <div className="toastIcon"><Mail size={16} /></div>
          <div>
            <div className="toastTitle">¡Sesión iniciada!</div>
            <div className="toastDesc">Redirigiendo al panel...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;