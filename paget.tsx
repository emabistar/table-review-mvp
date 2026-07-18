'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from './lib/supabaseClient';


type Business = {
  id: string;
  name: string;
  google_place_id: string | null;
};

type Stage = 'loading' | 'not_found' | 'form' | 'submitting' | 'result_high' | 'result_low';

export default function ReviewPage({ params }: { params: { businessId: string } }) {
  const { businessId } = params;
  const searchParams = useSearchParams();
  const table = searchParams.get('table'); // optional: /r/[id]?table=12

  const [business, setBusiness] = useState<Business | null>(null);
  const [stage, setStage] = useState<Stage>('loading');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  // Load the business this QR code belongs to
  useEffect(() => {
    async function loadBusiness() {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, google_place_id')
        .eq('id', businessId)
        .single();

      if (error || !data) {
        setStage('not_found');
        return;
      }
      setBusiness(data);
      setStage('form');
    }
    loadBusiness();
  }, [businessId]);

  async function handleSubmit() {
    if (rating === 0 || !business) return;
    setStage('submitting');

    const routedToGoogle = rating >= 4 && !!business.google_place_id;

    const { error } = await supabase.from('reviews').insert({
      business_id: business.id,
      customer_name: name.trim() || null,
      customer_phone: phone.trim() || null,
      rating,
      note: note.trim() || null,
      routed_to_google: routedToGoogle,
    });

    if (error) {
      // Simple MVP fallback — surface it and let them retry rather than losing the review
      alert('Something went wrong submitting your review. Please try again.');
      setStage('form');
      return;
    }

    if (routedToGoogle) {
      setStage('result_high');
      setTimeout(() => {
        window.location.href = `https://search.google.com/local/writereview?placeid=${business.google_place_id}`;
      }, 1800);
    } else {
      setStage('result_low');
    }
  }

  const firstName = name.trim().split(' ')[0] || 'there';
  const displayRating = hoverRating || rating;

  if (stage === 'loading') {
    return <div className="page-center">Loading…</div>;
  }

  if (stage === 'not_found') {
    return (
      <div className="page-center">
        This review link doesn&apos;t match a restaurant we know about.
      </div>
    );
  }

  return (
    <div className="review-page">
      {table && <div className="phone-hint">— scanned from Table {table} —</div>}

      <div className="stage">
        <div className="ticket">
          {(stage === 'form' || stage === 'submitting') && (
            <>
              <div className="ticket-head">
                {table && <div className="table-tag">Table No. {table}</div>}
                <div className="restaurant-name">{business?.name}</div>
                <div className="sub">Tell us how your visit went</div>
              </div>

              <div className="ticket-body">
                <span className="field-label">Your rating</span>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`star-btn ${
                        v <= displayRating ? (displayRating >= 4 ? 'stamped' : 'filled') : ''
                      }`}
                      onMouseEnter={() => setHoverRating(v)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(v)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z" />
                      </svg>
                    </button>
                  ))}
                </div>

                <div className="field">
                  <span className="field-label">Name</span>
                  <input
                    type="text"
                    placeholder="First name is fine"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <span className="field-label">
                    Phone <span className="soft">(optional — for a reply, not marketing)</span>
                  </span>
                  <input
                    type="tel"
                    placeholder="+45"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="field">
                  <span className="notes-label">A note for the kitchen, if you like</span>
                  <textarea
                    placeholder="Anything you want them to know..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="submit-row">
                  <button
                    className="stamp-btn"
                    disabled={rating === 0 || stage === 'submitting'}
                    onClick={handleSubmit}
                  >
                    {stage === 'submitting' ? 'Sending…' : 'Send review'}
                  </button>
                </div>
              </div>

              <div className="ticket-foot">{business?.name}</div>
            </>
          )}

          {stage === 'result_high' && (
            <div className="result show">
              <svg className="result-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z"
                  fill="#c69a2b"
                  stroke="#a67e1e"
                  strokeWidth="1.4"
                />
              </svg>
              <h2>Thank you, {firstName}.</h2>
              <p>
                So glad you had a good visit. Taking you to Google to share it publicly — this
                takes about ten seconds and really helps a small place like this.
              </p>
              <div className="redirect-bar">
                <div className="redirect-bar-fill" />
              </div>
            </div>
          )}

          {stage === 'result_low' && (
            <div className="result show">
              <svg className="result-icon" viewBox="0 0 24 24" fill="none" stroke="#8f2c22" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9.3" />
                <path
                  d="M9 10.5h.01M15 10.5h.01M8.5 15.5c1-1.2 2.2-1.8 3.5-1.8s2.5.6 3.5 1.8"
                  strokeLinecap="round"
                />
              </svg>
              <h2>Thanks for letting us know, {firstName}.</h2>
              <p>
                This isn&apos;t posted publicly. It&apos;s gone straight to the manager on duty,
                and if you left a number, someone will follow up.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .page-center {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #efe6d2;
          background: #161f1a;
        }

        .review-page {
          --ink: #161f1a;
          --kraft: #efe6d2;
          --brass: #c69a2b;
          --brass-dark: #a67e1e;
          --stamp: #b23a2e;
          --stamp-dark: #8f2c22;
          --slate: #5c6b62;
          --line: #c9bc9a;

          min-height: 100vh;
          background: var(--ink);
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--ink);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 16px 80px;
        }

        .phone-hint {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          color: #8a988f;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: 'IBM Plex Mono', monospace;
        }

        .stage {
          width: 100%;
          max-width: 400px;
          margin-top: 28px;
        }

        .ticket {
          position: relative;
          background: var(--kraft);
          border-radius: 2px;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6), 0 2px 0 rgba(255, 255, 255, 0.4) inset;
          overflow: hidden;
        }

        .ticket::before,
        .ticket::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 14px;
          background: radial-gradient(circle at 8px 7px, var(--ink) 6px, transparent 6.5px) repeat-x;
          background-size: 20px 14px;
        }
        .ticket::before {
          top: -7px;
        }
        .ticket::after {
          bottom: -7px;
        }

        .ticket-head {
          padding: 26px 26px 18px;
          border-bottom: 1.5px dashed var(--line);
          text-align: center;
        }

        .table-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--slate);
          text-transform: uppercase;
        }

        .restaurant-name {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 28px;
          line-height: 1.05;
          margin: 8px 0 4px;
        }

        .sub {
          font-size: 13px;
          color: var(--slate);
          font-style: italic;
          font-family: 'Fraunces', serif;
        }

        .ticket-body {
          padding: 22px 26px 26px;
        }

        .field-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--slate);
          margin-bottom: 8px;
          display: block;
        }
        .field-label .soft {
          text-transform: none;
          letter-spacing: 0;
        }

        .stars {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin: 6px 0 26px;
        }

        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          line-height: 0;
        }
        .star-btn svg {
          width: 38px;
          height: 38px;
          transition: transform 0.15s ease;
        }
        .star-btn:active svg {
          transform: scale(0.88);
        }
        .star-btn svg path {
          fill: transparent;
          stroke: var(--slate);
          stroke-width: 1.4;
          transition: fill 0.25s ease, stroke 0.25s ease;
        }
        .star-btn.filled svg path {
          fill: var(--brass);
          stroke: var(--brass-dark);
        }
        .star-btn.stamped svg path {
          fill: var(--stamp);
          stroke: var(--stamp-dark);
        }

        .field {
          margin-bottom: 18px;
        }
        .field input,
        .field textarea {
          width: 100%;
          border: none;
          border-bottom: 1.5px solid var(--line);
          background: transparent;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 15.5px;
          padding: 8px 2px;
          color: var(--ink);
          outline: none;
        }
        .field input::placeholder,
        .field textarea::placeholder {
          color: #a79c81;
        }
        .field input:focus,
        .field textarea:focus {
          border-bottom-color: var(--stamp);
        }
        .field textarea {
          resize: none;
          min-height: 56px;
          font-style: italic;
        }

        .notes-label {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--slate);
          margin-bottom: 6px;
          display: block;
        }

        .submit-row {
          margin-top: 24px;
          display: flex;
          justify-content: center;
        }

        .stamp-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: transparent;
          border: 2px solid var(--stamp);
          color: var(--stamp);
          padding: 12px 30px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .stamp-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .stamp-btn:not(:disabled):hover {
          background: var(--stamp);
          color: var(--kraft);
        }

        .ticket-foot {
          text-align: center;
          padding: 12px 26px 20px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #a79c81;
          letter-spacing: 0.1em;
        }

        .result {
          text-align: center;
          padding: 50px 30px 44px;
        }
        .result-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 18px;
        }
        .result h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 22px;
          margin: 0 0 10px;
        }
        .result p {
          font-size: 14px;
          color: var(--slate);
          line-height: 1.5;
          margin: 0 0 22px;
        }

        .redirect-bar {
          height: 3px;
          background: var(--line);
          border-radius: 2px;
          overflow: hidden;
          margin: 18px auto 0;
          width: 160px;
        }
        .redirect-bar-fill {
          height: 100%;
          width: 0%;
          background: var(--stamp);
          animation: fillbar 1.8s linear forwards;
        }
        @keyframes fillbar {
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
