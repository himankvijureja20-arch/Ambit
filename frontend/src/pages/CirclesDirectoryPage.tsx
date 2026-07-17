import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { circles, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, SegmentedControl, IconTile, CircleCardSkeleton } from '../components/ui';
import { CircleSummary } from '../types';
import { getCategoryStyle } from '../lib/category';

export default function CirclesDirectoryPage() {
  const [circlesList, setCirclesList] = useState<CircleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    try {
      const response = await circles.list();
      setCirclesList(response.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load circles'));
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(circlesList.map((c) => c.category)));
    return unique;
  }, [circlesList]);

  const filtered = circlesList.filter((c) => {
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleJoin = async (circleId: number) => {
    setJoiningId(circleId);
    try {
      await circles.join(circleId);
      setCirclesList((prev) =>
        prev.map((c) =>
          c.id === circleId
            ? { ...c, is_member: true, member_count: c.member_count + 1 }
            : c
        )
      );
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to join circle'));
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <AppLayout
      title="Circles"
      topAppBarActions={
        <Link
          to="/circles/new"
          className="text-sm font-semibold text-primary hover:text-primary-600"
        >
          + Create
        </Link>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-ink-secondary">
            Browse every Circle in your society and join the ones that fit you.
          </p>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a circle (e.g. Yoga, Security, Tech)..."
            className="w-full rounded-lg border-2 border-line bg-surface py-2.5 pl-11 pr-4 text-sm text-ink placeholder-ink-tertiary focus:border-sky-500 focus:outline-none"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-danger-bg p-4 text-sm font-semibold text-danger">
            {error}
          </div>
        )}

        {!loading && circlesList.length > 0 && categories.length > 1 && (
          <SegmentedControl
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[{ value: 'all', label: 'All' }, ...categories.map((c) => ({ value: c, label: c }))]}
          />
        )}

        {loading ? (
          <div className="space-y-4">
            <CircleCardSkeleton />
            <CircleCardSkeleton />
            <CircleCardSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center space-y-2">
            <div className="text-3xl">🔍</div>
            <p className="font-semibold text-navy-950">No circles found</p>
            <p className="text-sm text-ink-tertiary">Be the first to create one for this category</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((circle, i) => {
              const style = getCategoryStyle(circle.category);
              return (
                <Card
                  key={circle.id}
                  className="p-5 space-y-3 animate-fadeIn transition-all hover:shadow-raised hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <Link to={`/circles/${circle.id}`} className="block">
                    <div className="flex items-start gap-4">
                      <IconTile icon={style.icon} color={style.color} size="md" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display font-semibold text-navy-950">
                            {circle.name}
                          </h3>
                          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                            {circle.category}
                          </span>
                        </div>
                        <p className="text-sm text-ink-secondary line-clamp-2">
                          {circle.description}
                        </p>
                        <div className="flex gap-4 text-xs text-ink-tertiary">
                          <span>👥 {circle.member_count} members</span>
                          <span>📋 {circle.open_requests} open</span>
                        </div>
                        {circle.meeting_schedule && (
                          <p className="text-xs text-ink-secondary">
                            🕐 {circle.meeting_schedule}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="pt-1">
                    {circle.is_member ? (
                      <Button variant="ghost" size="sm" disabled className="w-full">
                        ✓ Joined
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={joiningId === circle.id}
                        onClick={() => handleJoin(circle.id)}
                        className="w-full"
                      >
                        Join Circle
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
            <Link
              to="/circles/new"
              className="block rounded-card border-2 border-dashed border-line p-8 text-center transition-colors hover:border-primary/50"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                +
              </div>
              <p className="mt-3 font-display font-semibold text-navy-950">Start a New Circle</p>
              <p className="mt-1 text-sm text-ink-tertiary">
                Have a unique hobby? Gather your neighbors and lead the way.
              </p>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
