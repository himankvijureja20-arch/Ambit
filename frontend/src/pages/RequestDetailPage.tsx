import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requests, getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Badge, Avatar, Textarea, SegmentedControl, TrustScoreBar } from '../components/ui';
import { RequestDetail } from '../types';
import { getRequestCategoryStyle, URGENCY_SHORT_LABELS, URGENCY_DOT } from '../lib/requestCategory';
import { timeAgo } from '../lib/timeAgo';

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function waLink(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}`;
}

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [responding, setResponding] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const response = await requests.get(Number(id));
      setRequest(response.data);
      const existing = response.data.responses.find((r: any) => r.responder_id === user?.id);
      if (existing) setMessage(existing.message || '');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to load request'));
    } finally {
      setLoading(false);
    }
  };

  const isCreator = request?.creator_id === user?.id;
  const myResponse = request?.responses.find((r) => r.responder_id === user?.id);

  const handleConfirmAndRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    setResponding(true);
    try {
      await requests.respond(request.id, { message: message || undefined, confirmed: true });
      await loadRequest();
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to respond'));
    } finally {
      setResponding(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!request) return;
    setUpdatingStatus(true);
    try {
      await requests.update(request.id, { status });
      await loadRequest();
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to update status'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const backTo = request
    ? request.circle_id ? `/circles/${request.circle_id}` : '/requests'
    : '/requests';

  if (loading) {
    return (
      <AppLayout title="Request" backTo="/requests">
        <div className="flex items-center justify-center py-12">
          <p className="text-ink-secondary">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (error && !request) {
    return (
      <AppLayout title="Request" backTo="/requests">
        <div className="text-center py-12">
          <p className="text-danger font-semibold">{error}</p>
        </div>
      </AppLayout>
    );
  }

  if (!request) return null;

  const categoryStyle = getRequestCategoryStyle(request.category);

  return (
    <AppLayout title="Request" backTo={backTo}>
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-danger-bg p-4 text-sm font-semibold text-danger">{error}</div>
        )}

        <Card
          className="p-5 space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-secondary">
              <span
                className={`h-1.5 w-1.5 rounded-full ${URGENCY_DOT[request.urgency]}`}
                aria-hidden
              />
              {URGENCY_SHORT_LABELS[request.urgency]}
            </span>
            <span className="text-xs text-ink-tertiary">Posted {timeAgo(request.created_at)}</span>
          </div>

          <h2 className="font-display text-lg font-semibold text-navy-950">{request.title}</h2>
          <p className="text-sm text-ink-secondary">{request.description}</p>

          {request.photo_url && (
            <img
              src={request.photo_url}
              alt=""
              className="w-full rounded-lg border border-line object-cover max-h-56"
            />
          )}

          <div className="grid grid-cols-3 gap-3 border-t border-line pt-4">
            {request.duration && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Duration</p>
                <p className="text-sm font-semibold text-navy-950">{request.duration}</p>
              </div>
            )}
            {request.location && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Location</p>
                <p className="text-sm font-semibold text-navy-950">{request.location}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Category</p>
              <p className="text-sm font-semibold text-navy-950">
                {categoryStyle.icon} {request.category || 'Other'}
              </p>
            </div>
          </div>

          {request.circle_name && (
            <p className="text-xs text-ink-tertiary border-t border-line pt-3">
              🔵 Posted in {request.circle_name}
            </p>
          )}

          {isCreator && (
            <div className="border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary mb-3">
                Update Status
              </p>
              <SegmentedControl value={request.status} onChange={handleStatusChange} options={statusOptions} />
              {updatingStatus && <p className="mt-2 text-xs text-ink-tertiary">Updating...</p>}
            </div>
          )}
        </Card>

        {!isCreator && (
          <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-navy-950 to-sky-700 p-6 shadow-raised">
            <div className="flex items-center gap-4">
              <Avatar
                initials={`${request.first_name[0]}${request.last_name[0]}`}
                size="lg"
                onDark
              />
              <div>
                <p className="font-display text-lg font-semibold text-white">
                  {request.first_name} {request.last_name}
                </p>
                <p className="text-xs text-white/70">
                  {request.creator_flat_number ? `Flat ${request.creator_flat_number}` : 'Resident'}
                </p>
              </div>
            </div>

            {request.creator_trust_score !== null && (
              <div className="mt-4">
                <TrustScoreBar
                  score={request.creator_trust_score}
                  label="Resident Trust Score"
                  size="sm"
                  onDark
                />
              </div>
            )}

            <div className="mt-4 flex gap-6 text-white">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Requests</p>
                <p className="font-display font-bold">{request.creator_request_count}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Helped</p>
                <p className="font-display font-bold">{request.creator_helped_count}</p>
              </div>
            </div>

            {myResponse?.confirmed ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-white">
                  {request.creator_phone
                    ? `Contact: ${request.creator_phone}`
                    : "This resident hasn't added a phone number yet."}
                </p>
                {request.creator_phone && (
                  <a
                    href={waLink(request.creator_phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-white py-3 font-display font-semibold text-navy-950"
                  >
                    Message on WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleConfirmAndRespond} className="mt-4 space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Let them know how you can help (optional)"
                  className="w-full rounded-lg border-0 bg-white/10 p-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                  rows={2}
                />
                <Button type="submit" variant="accent" loading={responding} className="w-full">
                  Confirm & Get Contact
                </Button>
              </form>
            )}
          </div>
        )}

        {isCreator && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
              Responses ({request.responses.length})
            </p>

            {request.responses.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-sm text-ink-secondary">No one has responded yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {request.responses.map((r) => (
                  <Card key={r.id} className="p-4 flex items-start gap-3">
                    <Avatar initials={`${r.first_name[0]}${r.last_name[0]}`} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-navy-950">
                          {r.first_name} {r.last_name}
                        </p>
                        {r.confirmed ? (
                          <Badge status="verified">Contact shared</Badge>
                        ) : (
                          <Badge status="active">Offered</Badge>
                        )}
                      </div>
                      {r.message && <p className="text-sm text-ink-secondary mt-1">{r.message}</p>}
                      {r.confirmed && r.phone && (
                        <a
                          href={waLink(r.phone)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-sm font-semibold text-sky-600 hover:text-sky-700"
                        >
                          {r.phone} · WhatsApp
                        </a>
                      )}
                      <p className="text-xs text-ink-tertiary mt-1">{timeAgo(r.responded_at)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <Card className="p-5 space-y-3">
          <p className="font-display font-semibold text-navy-950">Safety & Privacy</p>
          <p className="text-sm text-ink-secondary">
            ✅ Every resident here is verified by your society admin during onboarding.
          </p>
          <p className="text-sm text-ink-secondary">
            ✅ Contact details are only shared once you choose to confirm — never automatically.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
