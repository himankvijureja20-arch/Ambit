import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requests, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Card, SegmentedControl, IconTile, RequestCardSkeleton } from '../components/ui';
import { RequestSummary } from '../types';
import { getRequestCategoryStyle, URGENCY_SHORT_LABELS, URGENCY_DOT } from '../lib/requestCategory';
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
        <Card className="flex items-center justify-between gap-3 p-4">
          <p className="text-sm text-ink-secondary">Need a hand from a neighbor?</p>
          <Link
            to="/requests/new"
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-cta hover:bg-primary-600 transition-colors"
          >
            Post a Request
          </Link>
        </Card>

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
                  <Card className="p-4 transition-shadow hover:shadow-raised">
                    <div className="flex items-start gap-3.5">
                      <IconTile icon={style.icon} color="neutral" size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display font-semibold text-navy-950 leading-snug line-clamp-2">
                            {request.title}
                          </h3>
                          <span className="shrink-0 pt-0.5 text-xs text-ink-tertiary">
                            {timeAgo(request.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-secondary line-clamp-2">
                          {request.description}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-ink-tertiary">
                            {request.first_name} {request.last_name}
                            {request.circle_name ? ` · ${request.circle_name}` : ' · Society-wide'}
                          </span>
                          <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-secondary">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${URGENCY_DOT[request.urgency]}`}
                              aria-hidden
                            />
                            {URGENCY_SHORT_LABELS[request.urgency]}
                          </span>
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
