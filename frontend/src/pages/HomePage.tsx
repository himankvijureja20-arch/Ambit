import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { circles, requests, profile, getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../layouts/AppLayout';
import { Card, Badge, SectionHeader, IconTile, Avatar, CircleCardSkeleton } from '../components/ui';
import { CircleSummary, RequestSummary, TopHelper } from '../types';
import { getCategoryStyle } from '../lib/category';
import { getRequestCategoryStyle, URGENCY_SHORT_LABELS } from '../lib/requestCategory';

export default function HomePage() {
  const [circlesList, setCirclesList] = useState<CircleSummary[]>([]);
  const [requestsList, setRequestsList] = useState<RequestSummary[]>([]);
  const [topHelpers, setTopHelpers] = useState<TopHelper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    loadHome();
  }, []);

  const loadHome = async () => {
    try {
      const [circlesRes, requestsRes, helpersRes] = await Promise.all([
        circles.list(),
        requests.list(),
        profile.topHelpers(),
      ]);
      setCirclesList(circlesRes.data);
      setRequestsList(requestsRes.data);
      setTopHelpers(helpersRes.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load your home feed'));
    } finally {
      setLoading(false);
    }
  };

  const yourCircles = circlesList.filter((c) => c.is_member);
  const openRequests = requestsList.filter((r) => r.status === 'open').slice(0, 3);

  return (
    <AppLayout title="Home">
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-navy-950 via-navy-900 to-primary-700 p-6 shadow-raised">
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/40 blur-2xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-olive/20 blur-2xl"
            aria-hidden
          />
          <p className="relative font-display text-xl font-bold text-white">
            Hello, {user?.firstName} 👋
          </p>
          <p className="relative mt-1.5 text-sm text-white/80">
            Here's what's happening in your society right now.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-danger-bg p-4 text-sm font-semibold text-danger">{error}</div>
        )}

        {loading ? (
          <div className="space-y-4">
            <CircleCardSkeleton />
            <CircleCardSkeleton />
          </div>
        ) : (
          <>
            {topHelpers.length > 0 && (
              <div className="space-y-3">
                <SectionHeader>Top Helpers</SectionHeader>
                <div className="grid grid-cols-2 gap-3">
                  {topHelpers.map((helper) => (
                    <Card key={helper.id} className="p-4 flex items-center gap-3">
                      <Avatar
                        src={helper.photo_url || undefined}
                        initials={`${helper.first_name[0]}${helper.last_name[0]}`}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-semibold text-navy-950">
                          {helper.first_name} {helper.last_name}
                        </p>
                        <p className="text-xs text-ink-tertiary">⭐ {helper.trust_score} Trust</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <SectionHeader>Your Circles</SectionHeader>
                <Link to="/circles" className="text-sm font-semibold text-primary hover:text-primary-600">
                  Explore More
                </Link>
              </div>
              {yourCircles.length === 0 ? (
                <Card className="p-6 text-center space-y-1">
                  <div className="text-2xl">🔵</div>
                  <p className="text-sm font-semibold text-navy-950">No Circles yet</p>
                  <Link to="/circles" className="text-xs font-semibold text-primary hover:text-primary-600">
                    Browse the directory →
                  </Link>
                </Card>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 snap-x">
                  {yourCircles.map((circle) => {
                    const style = getCategoryStyle(circle.category);
                    return (
                      <Link
                        key={circle.id}
                        to={`/circles/${circle.id}`}
                        className="relative shrink-0 w-44 h-28 snap-start overflow-hidden rounded-card bg-gradient-to-br from-navy-900 to-primary-700 p-4 shadow-card flex flex-col justify-between"
                      >
                        <div className="text-2xl">{style.icon}</div>
                        <p className="mt-2 font-display font-semibold text-white leading-snug">
                          {circle.name}
                        </p>
                        <p className="mt-1 text-xs text-white/70">{circle.member_count} neighbors</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader>Recent Requests</SectionHeader>
                <Link to="/requests/new">
                  <span className="rounded-full bg-navy-950 px-3 py-1.5 text-xs font-semibold text-white">
                    + New Request
                  </span>
                </Link>
              </div>

              {openRequests.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-sm text-ink-secondary">No open requests right now</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {openRequests.map((request) => {
                    const style = getRequestCategoryStyle(request.category);
                    return (
                      <Link key={request.id} to={`/requests/${request.id}`}>
                        <Card className="p-4 flex gap-3 transition-all hover:shadow-raised hover:-translate-y-0.5">
                          <IconTile icon={style.icon} color={style.color} size="sm" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-display font-semibold text-navy-950 leading-snug">
                                {request.title}
                              </p>
                              <Badge
                                status={request.urgency === 'urgent' ? 'urgent' : 'active'}
                                className="shrink-0"
                              >
                                {URGENCY_SHORT_LABELS[request.urgency]}
                              </Badge>
                            </div>
                            <p className="text-sm text-ink-secondary line-clamp-1">
                              {request.description}
                            </p>
                            <p className="mt-1 text-xs text-ink-tertiary">
                              {request.first_name} {request.last_name}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                  <Link
                    to="/requests"
                    className="block text-center text-sm font-semibold text-primary hover:text-primary-600"
                  >
                    View all requests →
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
