import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile, getErrorMessage } from '../api/client';
import OnboardingLayout from '../layouts/OnboardingLayout';
import { Button, Chip } from '../components/ui';

const INTERESTS = [
  { label: 'Pickleball', icon: '🏓' },
  { label: 'Tennis', icon: '🎾' },
  { label: 'Yoga', icon: '🧘' },
  { label: 'Cooking', icon: '🍳' },
  { label: 'Board Games', icon: '♟️' },
  { label: 'Running', icon: '🏃' },
  { label: 'Cycling', icon: '🚴' },
  { label: 'Swimming', icon: '🏊' },
  { label: 'Reading', icon: '📚' },
  { label: 'Music', icon: '🎸' },
  { label: 'Photography', icon: '📸' },
  { label: 'Gardening', icon: '🌱' },
  { label: 'Art & Craft', icon: '🎨' },
  { label: 'Movies', icon: '🎬' },
  { label: 'Fitness', icon: '💪' },
  { label: 'Badminton', icon: '🏸' },
  { label: 'Cricket', icon: '🏏' },
  { label: 'Dancing', icon: '💃' },
];

export default function InterestSelectionPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setError('');
    try {
      await profile.update({ interests: selected });
      navigate('/');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to save interests'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            ✨
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-950">What interests you?</h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Pick a few — we'll find Circles that match.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-danger-bg p-3 text-sm font-semibold text-danger">{error}</div>
        )}

        {/* Interest chips */}
        <div className="flex flex-wrap gap-2.5">
          {INTERESTS.map((interest) => (
            <Chip
              key={interest.label}
              label={interest.label}
              icon={interest.icon}
              selected={selected.includes(interest.label)}
              onClick={() => toggle(interest.label)}
            />
          ))}
        </div>

        {selected.length > 0 && (
          <p className="text-center text-xs text-ink-tertiary animate-fadeIn">
            {selected.length} selected
          </p>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={selected.length === 0}
            size="lg"
            className="w-full"
          >
            {selected.length === 0 ? 'Select at least one' : 'Complete Setup →'}
          </Button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-center text-sm text-ink-tertiary hover:text-ink-secondary"
          >
            Skip for now
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
