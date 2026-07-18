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
      <div className="login-card">
        <div className="eyebrow">Owner sign in</div>
        <h1>Welcome back</h1>
        <p className="lede">
          Use the test account you created in Supabase → Authentication → Users.
        </p>

        <div className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
      </div>

      <style jsx global>{`
        .login-page {
          min-height: 100vh;
          background: #161f1a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          padding: 24px;
        }
        .login-card {
          width: 100%;
          max-width: 380px;
          background: #f7f2e4;
          border-radius: 8px;
          padding: 34px;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.55);
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5c6b62;
          margin-bottom: 6px;
        }
        h1 {
          font-size: 24px;
          margin: 0 0 6px;
          color: #161f1a;
        }
        .lede {
          font-size: 13.5px;
          color: #5c6b62;
          line-height: 1.5;
          margin: 0 0 22px;
        }
        .field {
          margin-bottom: 16px;
        }
        .field-label {
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
          padding: 10px 12px;
          font-size: 14.5px;
          background: #fff;
          outline: none;
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
          font-size: 12.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #b23a2e;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 12px;
          cursor: pointer;
        }
        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}