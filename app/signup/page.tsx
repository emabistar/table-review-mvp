'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Stage = 'form' | 'submitting' | 'done';

export default function SignupPage() {
  const [stage, setStage] = useState<Stage>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [reviewUrl, setReviewUrl] = useState('');

  async function handleSubmit() {
    setError(null);

    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Please fill in the restaurant name, email, and a password (6+ characters).');
      return;
    }

    setStage('submitting');

    // 1. Create the owner's login
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message || 'Could not create account.');
      setStage('form');
      return;
    }

    // 2. Create their business row, linked to the new account
    const { data: bizData, error: bizError } = await supabase
      .from('businesses')
      .insert({
        owner_id: signUpData.user.id,
        name: name.trim(),
        google_place_id: placeId.trim() || null,
      })
      .select()
      .single();

    if (bizError || !bizData) {
      setError(
        bizError?.message ||
          'Account created, but could not create the business. Make sure "Confirm email" is disabled in Supabase Auth settings.'
      );
      setStage('form');
      return;
    }

    const url = `${window.location.origin}/r/${bizData.id}`;
    setReviewUrl(url);
    setStage('done');
  }

  if (stage === 'done') {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(reviewUrl)}`;

    return (
      <div className="signup-page">
        <div className="card">
          <div className="eyebrow">You're set up</div>
          <h1>{name}</h1>
          <p className="lede">Your QR code is ready — scan it now to test, or print it for your tables.</p>

          <div className="qr-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImageUrl} alt="Review QR code" width={220} height={220} />
          </div>

          <div className="url-box">{reviewUrl}</div>

          <div className="btn-row">
            <a className="btn-primary" href={qrImageUrl} download={`${name}-qr-code.png`}>
              Download QR code
            </a>
            <a className="btn-ghost" href="/login">
              Go to dashboard
            </a>
          </div>

          <p className="fine-print">
            Log in any time at <strong>/login</strong> with {email} to see feedback come in.
            {!placeId && (
              <>
                {' '}
                You didn't add a Google Place ID yet — 5-star reviews won't redirect to Google
                until you add one. You can do this later.
              </>
            )}
          </p>
        </div>
        <style jsx global>{globalStyles}</style>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="card">
        <div className="eyebrow">New restaurant</div>
        <h1>Set up your review page</h1>
        <p className="lede">Takes about a minute. You'll get a QR code at the end.</p>

        <div className="field">
          <span className="field-label">Restaurant name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Kanelbrød & Co." />
        </div>

        <div className="field">
          <span className="field-label">Your email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@restaurant.dk"
          />
        </div>

        <div className="field">
          <span className="field-label">Choose a password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="field">
          <span className="field-label">
            Google Place ID <span className="soft">(optional — add later if easier)</span>
          </span>
          <input
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            placeholder="ChIJ..."
          />
          <p className="hint">
            Don't have it handy? Find it at Google's{' '}
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/place-id"
              target="_blank"
              rel="noopener noreferrer"
            >
              Place ID Finder
            </a>{' '}
            — or skip this and add it later.
          </p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="submit-btn" disabled={stage === 'submitting'} onClick={handleSubmit}>
          {stage === 'submitting' ? 'Setting up…' : 'Create my QR code'}
        </button>
      </div>
      <style jsx global>{globalStyles}</style>
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .signup-page {
    min-height: 100vh;
    background: #161f1a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 24px;
  }
  .card {
    width: 100%;
    max-width: 420px;
    background: #f7f2e4;
    border-radius: 8px;
    padding: 34px;
    box-shadow: 0 30px 60px -20px rgba(0,0,0,0.55);
  }
  .eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5c6b62;
    margin-bottom: 6px;
  }
  h1 {
    font-family: 'Fraunces', serif;
    font-weight: 600;
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
  .field { margin-bottom: 16px; }
  .field-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #5c6b62;
    margin-bottom: 6px;
    display: block;
  }
  .field-label .soft { text-transform: none; letter-spacing: 0; }
  .field input {
    width: 100%;
    border: 1.5px solid #d9cda9;
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 14.5px;
    font-family: inherit;
    background: #fff;
    outline: none;
  }
  .field input:focus { border-color: #b23a2e; }
  .hint {
    font-size: 12px;
    color: #5c6b62;
    margin: 6px 0 0;
    line-height: 1.4;
  }
  .hint a { color: #b23a2e; }
  .error-msg {
    font-size: 13px;
    color: #8f2c22;
    background: #fbe9e7;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 16px;
  }
  .submit-btn {
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
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .qr-wrap {
    display: flex;
    justify-content: center;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .url-box {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #5c6b62;
    background: #fff;
    border: 1px solid #d9cda9;
    border-radius: 6px;
    padding: 8px 12px;
    text-align: center;
    word-break: break-all;
    margin-bottom: 20px;
  }
  .btn-row { display: flex; gap: 10px; margin-bottom: 18px; }
  .btn-primary, .btn-ghost {
    flex: 1;
    text-align: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 11px;
    border-radius: 999px;
    text-decoration: none;
    cursor: pointer;
  }
  .btn-primary { background: #b23a2e; color: #fff; }
  .btn-ghost { background: transparent; border: 1.5px solid #5c6b62; color: #161f1a; }
  .fine-print {
    font-size: 12px;
    color: #5c6b62;
    line-height: 1.5;
    text-align: center;
    margin: 0;
  }
`;
