'use client';

import { useMusic } from '../context/MusicContext';

export default function AuthShell() {
  const { authMode, setAuthMode, authForm, setAuthForm, handleAuthSubmit, translate } = useMusic();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark wave-mark" aria-hidden="true"><i /></span>
          <h1>VOLTAGE MUSIC</h1>
        </div>
        <p className="auth-tag">{translate('auth.tagline')}</p>

        <div className="auth-toggle">
          <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
            {translate('auth.login')}
          </button>
          <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>
            {translate('auth.register')}
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="auth-form">
          {authMode === 'register' && (
            <label>
              {translate('auth.name')}
              <input type="text" name="name" value={authForm.name} onChange={handleChange} placeholder={translate('auth.name')} />
            </label>
          )}
          <label>
            {translate('auth.email')}
            <input type="email" name="email" value={authForm.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
          </label>
          <label>
            {translate('auth.password')}
            <input type="password" name="password" value={authForm.password} onChange={handleChange} placeholder="********" />
          </label>
          <button type="submit" className="primary-btn auth-submit">
            {authMode === 'login' ? translate('auth.submitLogin') : translate('auth.submitRegister')}
          </button>
        </form>

        <div className="demo-box">
          <span>{translate('auth.demo')}</span>
          <strong>demo@demo.com / 123456</strong>
        </div>
      </section>
    </main>
  );
}
