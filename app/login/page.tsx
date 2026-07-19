'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="login-page">
      <div className="brand-panel">
        <a href="/" className="wordmark">
          Scan<span className="wordmark-accent">Say</span>
        </a>
        <div className="brand-copy">
          <h1>Every table has something to say.</h1>
          <p>Sign in to see what came in today — good, bad, and everything worth acting on.</p>
        </div>
        <div className="brand-foot">
          <span className="mono-tag">No admin needed</span>
          <span className="mono-tag">Same-day feedback</span>
        </div>
      </div>

      <div className="form-panel">
        <div className="login-card">
          <div className="eyebrow">Owner sign in</div>
          <h2>Welcome back</h2>
          <p className="lede">Enter the email and password you used when you set up your QR code.</p>

          <div className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="you@restaurant.dk"
            />
          </div>

          <div className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button className="login-btn" disabled={loading} onClick={handleLogin}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="signup-hint">
            New here? <a href="/signup">Create your QR code</a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        html, body {
          margin: 0;
        }

        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .brand-panel {
          background: #171f1a;
          color: #fbf7ec;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .wordmark {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 22px;
          color: #fbf7ec;
          text-decoration: none;
        }
        .wordmark-accent { color: #b23a2e; }

        .brand-copy h1 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(28px, 3.4vw, 40px);
          line-height: 1.15;
          margin: 0 0 16px;
          max-width: 420px;
        }
        .brand-copy p {
          font-size: 15.5px;
          color: #b8c2ba;
          line-height: 1.6;
          max-width: 380px;
        }

        .brand-foot {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .mono-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9aa89e;
          border: 1.5px solid #384136;
          padding: 7px 14px;
          border-radius: 999px;
        }

        .form-panel {
          background: #efe6d2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 360px;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5c6b62;
          margin-bottom: 6px;
        }
        .login-card h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
          margin: 0 0 6px;
          color: #171f1a;
        }
        .lede {
          font-size: 13.5px;
          color: #5c6b62;
          line-height: 1.5;
          margin: 0 0 26px;
        }
        .field {
          margin-bottom: 16px;
        }
        .field-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5c6b62;
          margin-bottom: 6px;
          display: block;
        }
        .field input {
          width: 100%;
          border: 1.5px solid #d9cda9;
          border-radius: 6px;
          padding: 11px 12px;
          font-size: 14.5px;
          font-family: inherit;
          background: #fff;
          outline: none;
          box-sizing: border-box;
        }
        .field input:focus {
          border-color: #b23a2e;
        }
        .error-msg {
          font-size: 13px;
          color: #8f2c22;
          background: #fbe9e7;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 16px;
        }
        .login-btn {
          width: 100%;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #b23a2e;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 13px;
          cursor: pointer;
        }
        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .signup-hint {
          text-align: center;
          font-size: 13px;
          color: #5c6b62;
          margin-top: 20px;
        }
        .signup-hint a {
          color: #b23a2e;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 760px) {
          .login-page { grid-template-columns: 1fr; }
          .brand-panel { padding: 32px 24px; min-height: 220px; }
          .brand-copy p { display: none; }
        }
      `}</style>
    </div>
  );
}
