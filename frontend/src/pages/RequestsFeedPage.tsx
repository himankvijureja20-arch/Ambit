import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requests, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Card, Badge, SegmentedControl, IconTile, RequestCardSkeleton } from '../components/ui';
import { RequestSummary } from '../types';
import { getRequestCategoryStyle, URGENCY_SHORT_LABELS } from '../lib/requestCategory';
import { timeAgo } from '../lib/timeAgo';

export default function RequestsFeedPage() {
  const [requestsList, setRequestsList] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await requests.list();
      setRequestsList(response.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load requests'));
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    statusFilter === 'all' ? requestsList : requestsList.filter((r) => r.status === statusFilter);

  return (
    <AppLayout
      title="Requests"
      topAppBarActions={
        <Link to="/requests/new" className="text-sm font-semibold text-primary hover:text-primary-600">
          + New
        </Link>
      }
    >
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary-700 to-navy-950 p-6 shadow-raised">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <p className="relative font-display text-xl font-bold text-white">
            How can your neighbors help?
          </p>
          <p className="relative mt-1.5 text-sm text-white/80">
            One-off asks, visible to your whole society or just one Circle.
          </p>
          <Link
            to="/requests/new"
            className="relative mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-950"
          >
            + Post a Request
          </Link>
        </div>

        {error && (
          <div className="rounded-lg bg-danger-bg p-4 text-sm font-semibold text-danger">{error}</div>
        )}

        <SegmentedControl
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'completed', label: 'Completed' },
            { value: 'all', label: 'All' },
          ]}
        />

        {loading ? (
          <div className="space-y-4">
            <RequestCardSkeleton />
            <RequestCardSkeleton />
            <RequestCardSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center space-y-2">
            <div className="text-3xl">📋</div>
            <p className="font-semibold text-navy-950">No requests here yet</p>
            <p className="text-sm text-ink-tertiary">
              Need a hand with something? Be the first to ask.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((request, i) => {
              const style = getRequestCategoryStyle(request.category);
              return (
                <Link
                  key={request.id}
                  to={`/requests/${request.id}`}
                  className="block animate-fadeIn"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <Card
                    className={`p-5 transition-all hover:shadow-raised hover:-translate-y-0.5 border-l-4 ${
                      request.urgency === 'urgent'
                        ? 'border-l-danger'
                        : request.urgency === 'high'
                          ? 'border-l-amber'
                          : 'border-l-sky-500/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <IconTile icon={style.icon} color={style.color} size="md" />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display font-semibold text-navy-950 leading-snug">
                            {request.title}
                          </h3>
                          <span className="shrink-0 text-xs text-ink-tertiary">
                            {timeAgo(request.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-ink-secondary line-clamp-2">{request.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-ink-tertiary">
                            {request.first_name} {request.last_name}
                            {request.circle_name ? ` · ${request.circle_name}` : ' · Society-wide'}
                          </span>
                          <Badge
                            status={request.urgency === 'urgent' ? 'urgent' : 'active'}
                            className="shrink-0"
                          >
                            {URGENCY_SHORT_LABELS[request.urgency]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
