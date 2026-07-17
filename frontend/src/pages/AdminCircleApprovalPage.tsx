import { useState, useEffect } from 'react';
import { admin, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Badge, Avatar, TrustScoreBar, IconTile } from '../components/ui';
import { PendingCircle } from '../types';
import { getCategoryStyle } from '../lib/category';

export default function AdminCircleApprovalPage() {
  const [circlesList, setCirclesList] = useState<PendingCircle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await admin.pendingCircles();
      setCirclesList(response.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load pending circles'));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActingId(id);
    try {
      await admin.approveCircle(id);
      setCirclesList((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to approve circle'));
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActingId(id);
    try {
      await admin.rejectCircle(id);
      setCirclesList((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to reject circle'));
    } finally {
      setActingId(null);
    }
  };

  return (
    <AppLayout title="Circle Approvals" backTo="/admin">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-danger-bg p-4 text-sm font-semibold text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-ink-secondary">Loading...</p>
          </div>
        ) : circlesList.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-ink-secondary">No circles awaiting approval</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {circlesList.map((c) => {
              const style = getCategoryStyle(c.category);
              return (
                <Card key={c.id} className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <IconTile icon={style.icon} color={style.color} size="md" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-semibold text-navy-950">{c.name}</h4>
                        <Badge status="verified" className="shrink-0">
                          New Circle
                        </Badge>
                      </div>
                      <p className="text-sm text-ink-secondary mt-1">{c.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-app p-3">
                    <Avatar initials={`${c.first_name[0]}${c.last_name[0]}`} size="sm" />
                    <div className="flex-1">
                      <p className="text-xs text-ink-tertiary">
                        Founder: <span className="font-semibold text-navy-950">{c.first_name} {c.last_name}</span>
                      </p>
                      {c.founder_trust_score !== null && (
                        <TrustScoreBar score={c.founder_trust_score} label="" size="sm" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      loading={actingId === c.id}
                      onClick={() => handleReject(c.id)}
                    >
                      Deny
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      className="flex-1"
                      loading={actingId === c.id}
                      onClick={() => handleApprove(c.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
