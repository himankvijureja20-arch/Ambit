import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { circles, requests, getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Avatar, SectionHeader } from '../components/ui';
import { CircleDetail, RequestSummary } from '../types';
import { getCategoryStyle } from '../lib/category';
import { URGENCY_SHORT_LABELS, URGENCY_DOT } from '../lib/requestCategory';

export default function CircleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [circle, setCircle] = useState<CircleDetail | null>(null);
  const [circleRequests, setCircleRequests] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [membershipPending, setMembershipPending] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const circleResponse = await circles.get(Number(id));
      setCircle(circleResponse.data);
      const member = circleResponse.data.members.some((m: any) => m.id === user?.id);
      if (member) {
        const requestsResponse = await requests.listByCircle(Number(id));
        setCircleRequests(requestsResponse.data);
      }
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load circle'));
    } finally {
      setLoading(false);
    }
  };

  const isMember = circle ? circle.members.some((m) => m.id === user?.id) : false;

  const handleJoin = async () => {
    if (!circle) return;
    setMembershipPending(true);
    try {
      await circles.join(circle.id);
      await loadData();
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to join circle'));
    } finally {
      setMembershipPending(false);
    }
  };

  const handleLeave = async () => {
    if (!circle) return;
    setMembershipPending(true);
    try {
      await circles.leave(circle.id);
      await loadData();
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to leave circle'));
    } finally {
      setMembershipPending(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Circle" backTo="/circles">
        <div className="flex items-center justify-center py-12">
          <p className="text-ink-secondary">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !circle) {
    return (
      <AppLayout title="Circle" backTo="/circles">
        <div className="text-center py-12">
          <p className="text-danger font-semibold">{error || 'Circle not found'}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={circle.name}
      backTo="/circles"
      topAppBarActions={
        isMember ? (
          <Button variant="ghost" size="sm" loading={membershipPending} onClick={handleLeave}>
            Leave
          </Button>
        ) : (
          <Button variant="primary" size="sm" loading={membershipPending} onClick={handleJoin}>
            Join
          </Button>
        )
      }
    >
      <div className="space-y-6">
        {circle.status === 'pending' && (
          <div className="rounded-lg bg-amber-bg p-4 text-sm font-semibold text-amber-text">
            ⏳ This Circle is awaiting admin approval and isn't visible to other residents yet.
          </div>
        )}
        {circle.status === 'rejected' && (
          <div className="rounded-lg bg-danger-bg p-4 space-y-2 text-sm font-semibold text-danger">
            <p>This Circle was not approved by your society admin.</p>
            <Link to="/circles/new" className="inline-block underline">
              Create a new Circle →
            </Link>
          </div>
        )}

        <div className="rounded-card bg-gradient-to-br from-navy-950 to-primary-700 p-6 shadow-raised">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl">
              {getCategoryStyle(circle.category).icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {circle.category}
              </p>
              <h2 className="font-display text-xl font-bold text-white">{circle.name}</h2>
            </div>
          </div>
        </div>

        <Card className="p-5 space-y-4">
          <p className="text-sm text-ink-secondary">{circle.description}</p>

          {circle.meeting_schedule && (
            <div className="border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary mb-1">
                Meeting Schedule
              </p>
              <p className="text-sm text-ink-secondary">🕐 {circle.meeting_schedule}</p>
            </div>
          )}

          <div className="border-t border-line pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary mb-3">
              Members ({circle.members.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {circle.members.map((member) => (
                <Avatar
                  key={member.id}
                  initials={`${member.first_name[0]}${member.last_name[0]}`}
                  size="sm"
                  title={`${member.first_name} ${member.last_name}`}
                />
              ))}
            </div>
          </div>
        </Card>

        {isMember ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeader>Active Requests</SectionHeader>
              <Link
                to={`/requests/new?circleId=${circle.id}`}
                state={{ circleName: circle.name }}
              >
                <Button variant="accent" size="sm">
                  + Post
                </Button>
              </Link>
            </div>

            {circleRequests.length === 0 ? (
              <Card className="p-6 text-center space-y-1">
                <div className="text-2xl">📋</div>
                <p className="text-sm font-semibold text-navy-950">No requests yet</p>
                <p className="text-xs text-ink-tertiary">
                  Need a hand with something? Post the first Request.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {circleRequests.map((request) => (
                  <Link key={request.id} to={`/requests/${request.id}`}>
                    <Card className="p-4 transition-shadow hover:shadow-raised cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display font-semibold text-navy-950 leading-snug flex-1">
                          {request.title}
                        </h4>
                        {request.status === 'open' ? (
                          <span className="flex shrink-0 items-center gap-1.5 pt-0.5 text-xs font-medium text-ink-secondary">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${URGENCY_DOT[request.urgency]}`}
                              aria-hidden
                            />
                            {URGENCY_SHORT_LABELS[request.urgency]}
                          </span>
                        ) : (
                          <span className="shrink-0 pt-0.5 text-xs font-medium capitalize text-ink-tertiary">
                            {request.status}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink-secondary line-clamp-2">{request.description}</p>
                      <div className="mt-2.5 flex items-center justify-between text-xs text-ink-tertiary">
                        <span>
                          By {request.first_name} {request.last_name}
                        </span>
                        <span>💬 {request.response_count}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-ink-secondary">
              Join this Circle to see and post Requests.
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
