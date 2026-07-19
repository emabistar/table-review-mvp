

'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
type Business = {
  id: string;
  name: string;
  google_place_id: string | null;
};

type Stage = 'loading' | 'not_found' | 'form' | 'submitting' | 'result_offer' | 'result_thanks';

export default function ReviewPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = use(params);
  const searchParams = useSearchParams();
  const table = searchParams.get('table'); // optional: /r/[id]?table=12

  const [business, setBusiness] = useState<Business | null>(null);
  const [stage, setStage] = useState<Stage>('loading');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submittedReviewId, setSubmittedReviewId] = useState<string | null>(null);

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

    // Compliance note: Google's policy prohibits "review gating" — routing customers to
    // a public review link based on their sentiment/rating. Every customer gets the same
    // option to leave a Google review, regardless of what they rated. The private note/phone
    // capture below is an *additional* option for everyone, not a replacement for low ratings.
    const canOfferGoogle = !!business.google_place_id;

    const fullPhone = phone.trim() ? `+45 ${phone.trim()}` : null;
    const newReviewId = crypto.randomUUID();

    const { error } = await supabase.from('reviews').insert({
      id: newReviewId,
      business_id: business.id,
      customer_name: name.trim() || null,
      customer_phone: fullPhone,
      rating,
      note: note.trim() || null,
      routed_to_google: false, // set true below only if they actually click through
    });

    if (error) {
      // Simple MVP fallback — surface it and let them retry rather than losing the review
      alert('Something went wrong submitting your review. Please try again.');
      setStage('form');
      return;
    }

    setSubmittedReviewId(newReviewId);
    setStage(canOfferGoogle ? 'result_offer' : 'result_thanks');
  }

  async function goToGoogle() {
    if (business?.google_place_id) {
      if (submittedReviewId) {
        // Best-effort: record that they actually clicked through, not just that they were offered
        await supabase
          .from('reviews')
          .update({ routed_to_google: true })
          .eq('id', submittedReviewId);
      }
      window.location.href = `https://search.google.com/local/writereview?placeid=${business.google_place_id}`;
    }
  }

  const firstName = name.trim().split(' ')[0] || 'there';
  const displayRating = hoverRating || rating;

  return (
    <div className="review-page">
      {stage === 'loading' && <div className="page-center">Loading…</div>}

      {stage === 'not_found' && (
        <div className="page-center">
          This review link doesn&apos;t match a restaurant we know about.
        </div>
      )}

      {stage !== 'loading' && stage !== 'not_found' && (
      <>
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
                  <div className="phone-row">
                    <span className="phone-prefix">+45</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="20 12 34 56"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                    />
                  </div>
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

          {(stage === 'result_offer' || stage === 'result_thanks') && (
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

              {rating <= 3 ? (
                <p>
                  We've passed this straight to the manager on duty, and if you left a number,
                  someone will follow up. If you'd also like to share it publicly, that's
                  entirely up to you — the option's below either way.
                </p>
              ) : (
                <p>
                  So glad you had a good visit. If you have a moment, sharing it on Google
                  really helps a small place like this.
                </p>
              )}

              {stage === 'result_offer' && (
                <button className="stamp-btn" onClick={goToGoogle}>
                  Leave a Google review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {(stage === 'result_offer' || stage === 'result_thanks') && (
        <p className="skip-note">You can close this page any time — nothing else is required.</p>
      )}
      </>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .page-center {
          width: 100%;
          max-width: 400px;
          margin-top: 120px;
          text-align: center;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #efe6d2;
          font-size: 14.5px;
          line-height: 1.5;
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

        .phone-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .phone-prefix {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 15px;
          color: var(--slate);
          padding-bottom: 8px;
          flex-shrink: 0;
        }
        .phone-row input {
          flex: 1;
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
          max-width: 100%;
          box-sizing: border-box;
          white-space: normal;
          line-height: 1.4;
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
          padding: 50px 24px 44px;
          width: 100%;
          box-sizing: border-box;
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

        .result .stamp-btn {
          margin-top: 4px;
          padding: 12px 22px;
          font-size: 12px;
          letter-spacing: 0.1em;
        }

        .skip-note {
          text-align: center;
          font-size: 11.5px;
          color: #6b7970;
          margin-top: 14px;
          font-family: 'IBM Plex Mono', monospace;
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
