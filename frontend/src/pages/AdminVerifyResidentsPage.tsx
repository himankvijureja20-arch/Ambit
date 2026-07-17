import { useState, useEffect } from 'react';
import { admin, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Avatar } from '../components/ui';
import { PendingUser } from '../types';

export default function AdminVerifyResidentsPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await admin.pendingUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load pending residents'));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActingId(id);
    try {
      await admin.approveUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to approve resident'));
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActingId(id);
    try {
      await admin.rejectUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to reject resident'));
    } finally {
      setActingId(null);
    }
  };

  return (
    <AppLayout title="Verify Residents" backTo="/admin">
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
        ) : users.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-ink-secondary">No pending applications</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((u) => (
              <Card key={u.id} className="p-6 space-y-5">
                <div className="flex flex-col items-center text-center">
                  <Avatar initials={`${u.first_name[0]}${u.last_name[0]}`} size="lg" />
                  <p className="mt-3 font-display text-lg font-semibold text-navy-950">
                    {u.first_name} {u.last_name}
                  </p>
                  <span className="mt-1 rounded-full bg-sage-bg px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-sage-text">
                    Resident
                  </span>
                </div>

                <div className="space-y-3 border-t border-line pt-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                      Flat Number
                    </p>
                    <p className="text-sm font-semibold text-navy-950">{u.flat_number || '—'}</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                      Applied Date
                    </p>
                    <p className="text-sm font-semibold text-navy-950">
                      {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                      Contact
                    </p>
                    <p className="text-sm font-semibold text-navy-950">{u.phone || u.email}</p>
                  </div>
                </div>

                <div className="rounded-lg border-l-4 border-l-navy-950 bg-app p-3">
                  <p className="text-sm font-semibold text-navy-950">Verification Pending</p>
                  <p className="text-xs text-ink-secondary mt-0.5">
                    Cross-reference the flat number with your society's resident register before approving.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    loading={actingId === u.id}
                    onClick={() => handleReject(u.id)}
                  >
                    Reject & Notify
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    className="flex-1"
                    loading={actingId === u.id}
                    onClick={() => handleApprove(u.id)}
                  >
                    Approve Application
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
