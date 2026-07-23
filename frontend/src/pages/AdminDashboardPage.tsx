import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { admin } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Card, SectionHeader } from '../components/ui';

export default function AdminDashboardPage() {
  const [pendingUserCount, setPendingUserCount] = useState(0);
  const [pendingCircleCount, setPendingCircleCount] = useState(0);
  const [openRequestCount, setOpenRequestCount] = useState(0);
  const [flaggedRequestCount, setFlaggedRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const [users, circlesRes, requestsRes] = await Promise.all([
        admin.pendingUsers(),
        admin.pendingCircles(),
        admin.requests(),
      ]);
      setPendingUserCount(users.data.length);
      setPendingCircleCount(circlesRes.data.length);
      setOpenRequestCount(requestsRes.data.filter((r: any) => r.status === 'open').length);
      setFlaggedRequestCount(requestsRes.data.filter((r: any) => r.status === 'flagged').length);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      to: '/admin/residents',
      icon: '👤',
      bg: 'bg-info-bg',
      label: 'Pending Joins',
      value: pendingUserCount,
      cta: 'Review Applications',
    },
    {
      to: '/admin/circles',
      icon: '🔵',
      bg: 'bg-sage-bg',
      label: 'Pending Circles',
      value: pendingCircleCount,
      cta: 'Review Circles',
    },
    {
      to: '/admin/requests',
      icon: '🚩',
      bg: 'bg-danger-bg',
      label: 'Flagged Requests',
      value: flaggedRequestCount,
      cta: 'Dispatch Review',
    },
  ];

  return (
    <AppLayout title="Admin">
      <div className="space-y-6">
        <div className="rounded-card bg-gradient-to-br from-navy-950 to-primary-700 p-6 shadow-raised">
          <p className="font-display text-lg font-bold text-white">Society Overview</p>
          <p className="mt-1 text-sm text-white/75">
            Manage your community — approvals, circles, and content.
          </p>
        </div>

        <div className="space-y-3">
          {stats.map((s) => (
            <Link key={s.to} to={s.to}>
              <Card className="p-5 flex items-center gap-4 transition-all hover:shadow-raised hover:-translate-y-0.5">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${s.bg}`}>
                  {s.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">{s.label}</p>
                  <p className="font-display text-2xl font-bold text-navy-950">
                    {loading ? '—' : s.value}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  {s.cta}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Open Requests</p>
            <p className="font-display text-2xl font-bold text-navy-950">
              {loading ? '—' : openRequestCount}
            </p>
            <p className="text-xs text-ink-tertiary mt-0.5">Awaiting a neighbor's help</p>
          </div>
          <Link to="/admin/requests" className="text-sm font-semibold text-primary hover:text-primary-600">
            View all →
          </Link>
        </Card>
      </div>
    </AppLayout>
  );
}
