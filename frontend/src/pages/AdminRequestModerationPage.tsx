import { useState, useEffect } from 'react';
import { admin, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Badge, SegmentedControl } from '../components/ui';
import { AdminRequestSummary } from '../types';

export default function AdminRequestModerationPage() {
  const [requestsList, setRequestsList] = useState<AdminRequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState<number | null>(null);
  const [tab, setTab] = useState('needsAction');
  const [search, setSearch] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await admin.requests();
      setRequestsList(response.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load requests'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    setActingId(id);
    try {
      await admin.removeRequest(id);
      setRequestsList((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)));
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to remove request'));
    } finally {
      setActingId(null);
    }
  };

  const handleFlag = async (id: number) => {
    setActingId(id);
    try {
      await admin.flagRequest(id);
      setRequestsList((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'flagged' } : r)));
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to flag request'));
    } finally {
      setActingId(null);
    }
  };

  const handleUnflag = async (id: number) => {
    setActingId(id);
    try {
      await admin.unflagRequest(id);
      setRequestsList((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'open' } : r)));
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to clear flag'));
    } finally {
      setActingId(null);
    }
  };

  const pendingCount = requestsList.filter((r) => r.status === 'open').length;
  const flaggedCount = requestsList.filter((r) => r.status === 'flagged').length;
  const urgentOpen = requestsList.filter((r) => r.status === 'open' && r.urgency === 'urgent');

  const byTab =
    tab === 'needsAction'
      ? requestsList.filter((r) => r.status === 'open' || r.status === 'flagged')
      : requestsList;
  const filtered = byTab.filter((r) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      r.title.toLowerCase().includes(query) ||
      `${r.first_name} ${r.last_name}`.toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout title="Requests" backTo="/admin">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-navy-950">Request Moderation</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Review and manage all requests posted across your society.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-danger-bg p-4 text-sm font-semibold text-danger">{error}</div>
        )}

        <Card className="p-5 flex justify-between">
          <div>
            <p className="font-display text-3xl font-bold text-navy-950">{loading ? '—' : pendingCount}</p>
            <p className="text-xs text-ink-tertiary">Pending</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-danger">{loading ? '—' : flaggedCount}</p>
            <p className="text-xs text-ink-tertiary">Flagged</p>
          </div>
        </Card>

        {urgentOpen.length > 0 && (
          <div className="rounded-lg border-l-4 border-l-amber bg-amber-bg p-4">
            <p className="text-sm font-semibold text-amber-text">
              ⚠️ {urgentOpen.length} urgent request{urgentOpen.length > 1 ? 's' : ''} still open
            </p>
            <p className="text-xs text-amber-text mt-0.5">
              "{urgentOpen[0].title}" needs a resident's attention.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SegmentedControl
              value={tab}
              onChange={setTab}
              options={[
                { value: 'needsAction', label: 'Needs Action' },
                { value: 'all', label: 'All Requests' },
              ]}
            />
          </div>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or resident..."
          className="w-full rounded-lg border-2 border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder-ink-tertiary focus:border-primary focus:outline-none"
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-ink-secondary">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-ink-secondary">No requests in this filter</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <Card key={r.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-display font-semibold text-navy-950 flex-1">{r.title}</h4>
                  <Badge
                    status={
                      r.status === 'flagged' ? 'urgent' : r.status === 'open' ? 'active' : 'verified'
                    }
                    className="shrink-0"
                  >
                    {r.status}
                  </Badge>
                </div>
                <p className="text-sm text-ink-secondary">{r.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-ink-tertiary">
                  <span>{r.circle_name ? `🔵 ${r.circle_name}` : '🌐 Society-wide'}</span>
                  <span>
                    By {r.first_name} {r.last_name}
                  </span>
                  <span>💬 {r.response_count}</span>
                </div>
                {r.status !== 'cancelled' && (
                  <div className="flex gap-3">
                    {r.status === 'flagged' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        loading={actingId === r.id}
                        onClick={() => handleUnflag(r.id)}
                      >
                        Clear Flag
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        loading={actingId === r.id}
                        onClick={() => handleFlag(r.id)}
                      >
                        Flag Issue
                      </Button>
                    )}
                    <Button
                      variant="accent"
                      size="sm"
                      className="flex-1"
                      loading={actingId === r.id}
                      onClick={() => handleRemove(r.id)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
