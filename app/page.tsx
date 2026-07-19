export default function LandingPage() {
  return (
    <div className="land">
      <nav className="nav">
        <span className="wordmark">
          Scan<span className="wordmark-accent">Say</span>
        </span>
        <a href="/login" className="nav-link">
          Owner sign in
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">For restaurants, salons, cafés &amp; more</span>
          <h1>
            They already told the waiter.
            <br />
            Now let them tell <em>you</em>.
          </h1>
          <p className="hero-sub">
            A QR code on the table. A ten-second form. Every rating — good or bad —
            captured the moment it happens, instead of never happening at all.
          </p>
          <div className="hero-actions">
            <a href="/signup" className="btn-stamp">
              Get your QR code
            </a>
            <a href="#how" className="btn-ghost">
              See how it works
            </a>
          </div>
          <p className="hero-fine">No app to install. Set up in under a minute.</p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="ticket-card">
            <div className="ticket-stamp">4.7★</div>
            <div className="ticket-head">
              <div className="ticket-table">Table 12</div>
              <div className="ticket-name">Kanelbrød &amp; Co.</div>
              <div className="ticket-sub">Tell us how your visit went</div>
            </div>
            <div className="ticket-stars">★ ★ ★ ★ ★</div>
            <div className="ticket-line" />
            <div className="ticket-line short" />
            <div className="ticket-btn">Send review</div>
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <section className="story">
        <span className="eyebrow center">Why this exists</span>
        <h2 className="section-title center">Two moments, one missing piece</h2>

        <div className="story-grid">
          <div className="story-card">
            <span className="story-mark good">✓</span>
            <p>
              "The food was genuinely good. I wanted to leave a review right then —
              but there was no simple way to do it at the table. Like most people,
              I never got around to it later."
            </p>
          </div>
          <div className="story-card">
            <span className="story-mark warn">!</span>
            <p>
              "I wanted to try another restaurant. I looked it up first — the reviews
              were a year old. I had no idea if the food or service were still the
              same."
            </p>
          </div>
        </div>
        <p className="story-conclusion">
          Both moments come from the same gap: no channel exists at the exact moment
          feedback is easiest to give. ScanSay is that channel.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <span className="eyebrow center">The process</span>
        <h2 className="section-title center">Three steps, no app required</h2>

        <div className="steps">
          <div className="step">
            <span className="step-num">01</span>
            <h3>Scan</h3>
            <p>Customer points their phone camera at the table code. A form opens instantly in their browser.</p>
          </div>
          <div className="step">
            <span className="step-num">02</span>
            <h3>Rate</h3>
            <p>Stars, a name, an optional note. Twenty seconds, no account, no download.</p>
          </div>
          <div className="step">
            <span className="step-num">03</span>
            <h3>You know</h3>
            <p>Good ratings get an easy path to Google. Anything less lands straight on your dashboard, same day.</p>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="who">
        <span className="eyebrow center">Any business with a door and a queue</span>
        <div className="chips">
          {['Restaurants', 'Cafés', 'Salons', 'Barbershops', 'Gyms', 'Clinics', 'Retail'].map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta">
        <h2>Ready to hear what walked out the door today?</h2>
        <a href="/signup" className="btn-stamp large">
          Create my QR code — free
        </a>
      </section>

      <footer className="footer">
        <span className="wordmark small">
          Scan<span className="wordmark-accent">Say</span>
        </span>
        <a href="/login">Owner sign in</a>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        :root {
          --ink: #171f1a;
          --kraft: #efe6d2;
          --paper: #fbf7ec;
          --brass: #c69a2b;
          --brass-dark: #a67e1e;
          --stamp: #b23a2e;
          --stamp-dark: #8f2c22;
          --slate: #5c6b62;
          --line: #384136;
        }

        * { box-sizing: border-box; }

        .land {
          background: var(--ink);
          color: var(--paper);
          font-family: 'IBM Plex Sans', sans-serif;
          overflow-x: hidden;
        }

        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--brass);
          display: block;
          margin-bottom: 14px;
        }
        .eyebrow.center { text-align: center; }

        .section-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(26px, 4vw, 38px);
          color: var(--paper);
          margin: 0 0 40px;
          line-height: 1.15;
        }
        .section-title.center { text-align: center; }

        /* NAV */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 5vw;
          max-width: 1200px;
          margin: 0 auto;
        }
        .wordmark {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 22px;
          color: var(--paper);
          letter-spacing: -0.01em;
        }
        .wordmark.small { font-size: 17px; }
        .wordmark-accent { color: var(--stamp); }
        .nav-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9aa89e;
          text-decoration: none;
          border: 1.5px solid #384136;
          padding: 8px 16px;
          border-radius: 999px;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .nav-link:hover { border-color: var(--brass); color: var(--brass); }

        /* HERO */
        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 5vw 100px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: center;
        }
        .hero h1 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(32px, 4.6vw, 52px);
          line-height: 1.1;
          margin: 0 0 22px;
          color: var(--paper);
        }
        .hero h1 em {
          font-style: italic;
          color: var(--brass);
        }
        .hero-sub {
          font-size: 17px;
          color: #b8c2ba;
          line-height: 1.6;
          max-width: 480px;
          margin: 0 0 30px;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .hero-fine {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #77857c;
        }

        .btn-stamp {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--stamp);
          color: #fff;
          border: 2px solid var(--stamp);
          padding: 14px 26px;
          border-radius: 999px;
          text-decoration: none;
          transition: transform 0.15s ease, background 0.2s ease;
          display: inline-block;
        }
        .btn-stamp:hover { background: var(--stamp-dark); transform: translateY(-1px); }
        .btn-stamp.large { font-size: 15px; padding: 17px 34px; }

        .btn-ghost {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: transparent;
          color: var(--paper);
          border: 2px solid #384136;
          padding: 14px 26px;
          border-radius: 999px;
          text-decoration: none;
          transition: border-color 0.2s ease;
          display: inline-block;
        }
        .btn-ghost:hover { border-color: var(--brass); }

        /* HERO VISUAL — the signature element */
        .hero-visual {
          display: flex;
          justify-content: center;
        }
        .ticket-card {
          position: relative;
          width: 260px;
          background: var(--kraft);
          border-radius: 3px;
          padding: 30px 26px 26px;
          color: var(--ink);
          transform: rotate(4deg);
          box-shadow: 0 40px 70px -20px rgba(0,0,0,0.55);
          animation: settle 0.9s cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes settle {
          from { transform: rotate(11deg) translateY(18px); opacity: 0; }
          to { transform: rotate(4deg) translateY(0); opacity: 1; }
        }
        .ticket-stamp {
          position: absolute;
          top: -14px;
          right: -10px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid var(--brass);
          background: var(--paper);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          color: var(--brass-dark);
          transform: rotate(-10deg);
          animation: stamp-in 0.5s 0.7s cubic-bezier(.3,1.5,.4,1) both;
        }
        @keyframes stamp-in {
          from { transform: rotate(-10deg) scale(0); opacity: 0; }
          to { transform: rotate(-10deg) scale(1); opacity: 1; }
        }
        .ticket-head { text-align: center; border-bottom: 1.5px dashed #c9bc9a; padding-bottom: 14px; margin-bottom: 14px; }
        .ticket-table {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--slate);
          margin-bottom: 6px;
        }
        .ticket-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; }
        .ticket-sub { font-family: 'Fraunces', serif; font-style: italic; font-size: 12px; color: var(--slate); margin-top: 2px; }
        .ticket-stars { text-align: center; color: var(--brass-dark); font-size: 24px; letter-spacing: 4px; margin-bottom: 18px; }
        .ticket-line { height: 8px; border-radius: 4px; background: #ddd0af; margin-bottom: 10px; }
        .ticket-line.short { width: 60%; }
        .ticket-btn {
          margin-top: 16px;
          text-align: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1.5px solid var(--stamp);
          color: var(--stamp);
          padding: 10px;
          border-radius: 999px;
        }

        /* STORY */
        .story {
          max-width: 900px;
          margin: 0 auto;
          padding: 90px 5vw;
        }
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          margin-bottom: 34px;
        }
        .story-card {
          background: #1e2820;
          border: 1px solid #2c362f;
          border-radius: 8px;
          padding: 28px 24px;
          position: relative;
        }
        .story-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 14px;
        }
        .story-mark.good { background: rgba(198,154,43,0.18); color: var(--brass); }
        .story-mark.warn { background: rgba(178,58,46,0.18); color: var(--stamp); }
        .story-card p {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 16.5px;
          line-height: 1.6;
          color: #d8dfd9;
          margin: 0;
        }
        .story-conclusion {
          text-align: center;
          font-size: 16px;
          color: #b8c2ba;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto;
        }

        /* HOW IT WORKS */
        .how {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 5vw 100px;
        }
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .step {
          border-top: 2px solid var(--brass);
          padding-top: 20px;
        }
        .step-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: var(--brass);
          letter-spacing: 0.1em;
        }
        .step h3 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 22px;
          margin: 10px 0 8px;
          color: var(--paper);
        }
        .step p {
          font-size: 14.5px;
          color: #b8c2ba;
          line-height: 1.55;
          margin: 0;
        }

        /* WHO */
        .who {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 5vw 100px;
          text-align: center;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .chip {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.06em;
          color: #d8dfd9;
          border: 1.5px solid #384136;
          padding: 8px 16px;
          border-radius: 999px;
        }

        /* CTA */
        .cta {
          max-width: 700px;
          margin: 0 auto;
          padding: 40px 5vw 120px;
          text-align: center;
        }
        .cta h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(24px, 3.6vw, 32px);
          margin: 0 0 28px;
          color: var(--paper);
        }

        /* FOOTER */
        .footer {
          border-top: 1px solid #2c362f;
          padding: 28px 5vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer a {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #77857c;
          text-decoration: none;
        }
        .footer a:hover { color: var(--brass); }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .hero { grid-template-columns: 1fr; padding-top: 20px; }
          .hero-visual { order: -1; margin-bottom: 10px; }
          .story-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr; gap: 34px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticket-card, .ticket-stamp { animation: none; }
        }
      `}</style>
    </div>
  );
}
