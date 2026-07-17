import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { circles, getErrorMessage } from '../api/client';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Input, Textarea } from '../components/ui';
import { CIRCLE_CATEGORIES } from '../types';

const selectClasses =
  'w-full px-4 py-2.5 rounded-lg border-2 border-line bg-surface text-ink transition-colors focus:border-primary focus:outline-none';

export default function CreateCirclePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CIRCLE_CATEGORIES[0]);
  const [meetingSchedule, setMeetingSchedule] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await circles.create({
        name,
        description: description || undefined,
        category,
        meetingSchedule: meetingSchedule || undefined,
        imageUrl: imageUrl || undefined,
      });
      navigate(`/circles/${response.data.id}`);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to create circle'));
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Circle" backTo="/circles">
      <div className="space-y-4">

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-navy-950 mb-1">
              Start a new Circle
            </h2>
            <p className="text-sm text-ink-secondary">
              Circles are ongoing groups around a shared interest — neighbors join over time.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-danger-bg p-3 text-sm font-semibold text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Circle Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pickleball Group"
              required
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this Circle about?"
            />

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Category</label>
              <select
                className={selectClasses}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CIRCLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Meeting Schedule (optional)"
              value={meetingSchedule}
              onChange={(e) => setMeetingSchedule(e.target.value)}
              placeholder="Tue/Thu 6 PM"
            />

            <Input
              label="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />

            <Button type="submit" loading={submitting} size="lg" className="w-full">
              Create Circle
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
