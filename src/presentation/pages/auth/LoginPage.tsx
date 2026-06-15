import React, { useState, useCallback } from 'react';
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

  const handleGoogle = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    toast.success('¡Autenticado con Google!');
    setTimeout(() => navigate('/cliente/inicio', { replace: true }), 1000);
  }, [navigate]);

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

          {/* Google Button */}
          <button className="googleBtn" onClick={handleGoogle} disabled={loading}>
            <svg className="googleIcon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

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