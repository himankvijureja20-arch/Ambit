import { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { requests, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Textarea, SegmentedControl } from '../components/ui';
import { REQUEST_CATEGORIES, URGENCY_LABELS } from '../lib/requestCategory';
import { RequestUrgency } from '../types';

const inputClasses =
  'w-full px-4 py-2.5 rounded-lg border-2 border-line bg-surface text-ink placeholder-ink-tertiary transition-colors focus:border-sky-500 focus:outline-none';

const URGENCY_OPTIONS: { value: RequestUrgency; label: string }[] = [
  { value: 'normal', label: URGENCY_LABELS.normal },
  { value: 'high', label: URGENCY_LABELS.high },
  { value: 'urgent', label: URGENCY_LABELS.urgent },
];

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const circleId = searchParams.get('circleId');
  const circleName = (location.state as { circleName?: string } | null)?.circleName;

  const [category, setCategory] = useState(REQUEST_CATEGORIES[0].value);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<RequestUrgency>('high');
  const [location_, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await requests.create({
        circleId: circleId ? Number(circleId) : undefined,
        title,
        description,
        category,
        urgency,
        location: location_ || undefined,
        duration: duration || undefined,
        photoUrl: photoUrl || undefined,
      });
      navigate(`/requests/${response.data.id}`);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to post request'));
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="New Request" backTo={circleId ? `/circles/${circleId}` : '/requests'}>
      <div className="space-y-4">

        <div className="rounded-lg border-l-4 border-l-amber bg-app p-4 space-y-1">
          <p className="font-display font-semibold text-navy-950">How can your neighbors help?</p>
          <p className="text-sm text-ink-secondary">
            {circleName
              ? `This will be posted to ${circleName} only.`
              : 'Your request will be broadcast to verified residents in your society.'}
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-danger-bg p-3 text-sm font-semibold text-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Category</p>
            {REQUEST_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`w-full rounded-card border-2 p-4 text-left transition-colors ${
                  category === c.value
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-line bg-surface hover:border-sky-500/40'
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <p className="mt-2 font-display font-semibold text-navy-950">{c.value}</p>
                <p className="text-sm text-ink-secondary">{c.description}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Title</label>
            <input
              className={inputClasses}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Need a power drill for 1 hour"
              required
            />
          </div>

          <Textarea
            label="What do you need help with?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Need a power drill for 1 hour to hang a few pictures in the hallway."
            required
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary mb-3">
              Urgency Level
            </p>
            <SegmentedControl
              value={urgency}
              onChange={(v) => setUrgency(v as RequestUrgency)}
              options={URGENCY_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                Duration (optional)
              </label>
              <input
                className={inputClasses}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="20-30 mins"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                Meeting point (optional)
              </label>
              <input
                className={inputClasses}
                value={location_}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Wing C lobby"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Photo URL (optional)</label>
            <input
              className={inputClasses}
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <p className="text-sm text-ink-secondary">
            By posting, you agree to Ambit's community guidelines for respectful, safe coordination.
          </p>

          <Button type="submit" variant="accent" loading={submitting} size="lg" className="w-full">
            Post Request
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
