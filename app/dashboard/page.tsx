'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
type Business = { id: string; name: string };
type Review = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  rating: number;
  note: string | null;
  resolved: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push('/login');
        return;
      }

      const { data: biz } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', userData.user.id)
        .single();

      if (!biz) {
        setLoading(false);
        return;
      }
      setBusiness(biz);

      // All reviews this week, for the stat row
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: weekReviews } = await supabase
        .from('reviews')
        .select('id, rating, resolved, customer_name, customer_phone, note, created_at')
        .eq('business_id', biz.id)
        .gte('created_at', weekAgo);
      setAllReviews(weekReviews || []);

      // Just the low-rating ones needing attention, for the alert list
      const { data: lowReviews } = await supabase
        .from('reviews')
        .select('id, rating, resolved, customer_name, customer_phone, note, created_at')
        .eq('business_id', biz.id)
        .lte('rating', 3)
        .order('created_at', { ascending: false });
      setReviews(lowReviews || []);

      setLoading(false);
    }
    load();
  }, [router]);

  async function markResolved(id: string) {
    await supabase.from('reviews').update({ resolved: true }).eq('id', id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, resolved: true } : r)));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return <div className="page-center">Loading…</div>;

  if (!business) {
    return (
      <div className="page-center">
        No business is linked to this account yet — insert one via the businesses table
        with owner_id set to your logged-in user.
      </div>
    );
  }

  const avgRating = allReviews.length
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : '—';
  const unresolvedCount = reviews.filter((r) => !r.resolved).length;

  function maskPhone(phone: string | null) {
    if (!phone) return null;
    if (phone.length <= 4) return phone;
    return phone.slice(0, phone.length - 4).replace(/\d/g, '·') + phone.slice(-4);
  }

  function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="dash-page">
      <div className="wrap">
        <div className="top-row">
          <span className="eyebrow">{business.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>

        <div className="card">
          <h1>This week</h1>
          <p className="lede">
            Everything scanned from your tables, sorted so the 5-stars go to Google and the
            rest lands here first.
          </p>

          <div className="stat-row">
            <div className="stat">
              <div className="stat-num gold">{avgRating}</div>
              <div className="stat-label">Avg. rating</div>
            </div>
            <div className="stat">
              <div className="stat-num">{allReviews.length}</div>
              <div className="stat-label">Reviews this week</div>
            </div>
            <div className="stat">
              <div className="stat-num red">{unresolvedCount}</div>
              <div className="stat-label">Need a reply</div>
            </div>
          </div>

          <div className="section-label">Private feedback (1–3★) — not posted publicly</div>

          {reviews.length === 0 && (
            <p className="lede">No low-rating feedback yet — nice work.</p>
          )}

          {reviews.map((r) => (
            <div className={`alert-item ${r.resolved ? 'resolved' : ''}`} key={r.id}>
              <div className="alert-top">
                <span className="alert-name">{r.customer_name || 'Anonymous'}</span>
                <span className="alert-meta">{timeAgo(r.created_at)}</span>
              </div>
              <div className="alert-stars">
                {'★'.repeat(r.rating)}
                {'☆'.repeat(5 - r.rating)}
              </div>
              <div className="alert-note">
                {r.note ? `"${r.note}"` : 'No note left.'}
              </div>
              <div className="alert-actions">
                {!r.resolved && (
                  <button className="alert-btn primary" onClick={() => markResolved(r.id)}>
                    Mark resolved
                  </button>
                )}
                {r.customer_phone && (
                  <>
                    <a className="alert-btn" href={`tel:${r.customer_phone.replace(/\s/g, '')}`}>
                      Call {maskPhone(r.customer_phone)}
                    </a>
                    <a className="alert-btn" href={`sms:${r.customer_phone.replace(/\s/g, '')}`}>
                      Text
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .page-center {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #efe6d2;
          background: #161f1a;
        }

        .dash-page {
          min-height: 100vh;
          background: #161f1a;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #161f1a;
          padding: 36px 16px 80px;
        }
        .wrap {
          max-width: 640px;
          margin: 0 auto;
        }
        .top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .top-row .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #cfc4a4;
        }
        .logout-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: transparent;
          border: 1.5px solid #3a463d;
          color: #8a988f;
          padding: 6px 14px;
          border-radius: 999px;
          cursor: pointer;
        }

        .card {
          background: #f7f2e4;
          border-radius: 6px;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.55);
          padding: 34px;
        }
        h1 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
          margin: 0 0 6px;
        }
        .lede {
          color: #5c6b62;
          font-size: 14.5px;
          margin: 0 0 26px;
          line-height: 1.5;
        }

        .stat-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .stat {
          background: #fff;
          border: 1.5px solid #d9cda9;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }
        .stat-num {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
        }
        .stat-num.gold {
          color: #a67e1e;
        }
        .stat-num.red {
          color: #8f2c22;
        }
        .stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5c6b62;
          margin-top: 4px;
        }

        .section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5c6b62;
          margin-bottom: 12px;
        }

        .alert-item {
          background: #fff;
          border: 1.5px solid #d9cda9;
          border-left: 4px solid #b23a2e;
          border-radius: 6px;
          padding: 14px 16px;
          margin-bottom: 10px;
          transition: opacity 0.3s ease;
        }
        .alert-item.resolved {
          border-left-color: #3d6b4f;
          opacity: 0.5;
        }
        .alert-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }
        .alert-name {
          font-weight: 600;
          font-size: 14px;
        }
        .alert-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          color: #5c6b62;
        }
        .alert-stars {
          color: #b23a2e;
          font-size: 13px;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .alert-note {
          font-size: 13.5px;
          font-style: italic;
          color: #3a4640;
          margin-bottom: 10px;
          line-height: 1.45;
        }
        .alert-actions {
          display: flex;
          gap: 8px;
        }
        .alert-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1.5px solid #d9cda9;
          background: transparent;
          padding: 6px 12px;
          border-radius: 999px;
          cursor: pointer;
          text-decoration: none;
          color: #161f1a;
          display: inline-flex;
          align-items: center;
        }
        .alert-btn.primary {
          background: #3d6b4f;
          border-color: #3d6b4f;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
