import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profile, getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../layouts/AppLayout';
import { Button, Card, Avatar, Badge, Input, SectionHeader, TrustScoreBar, IconTile } from '../components/ui';
import { Profile, CircleSummary } from '../types';
import { getCategoryStyle } from '../lib/category';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userCircles, setUserCircles] = useState<CircleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileResponse = await profile.get();
      setUserProfile(profileResponse.data);
      syncFormState(profileResponse.data);
      const circlesResponse = await profile.getCircles();
      setUserCircles(circlesResponse.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncFormState = (p: Profile) => {
    setFirstName(p.first_name);
    setLastName(p.last_name);
    setPhone(p.phone || '');
    setFlatNumber(p.flat_number || '');
    setInterests(p.interests);
  };

  const startEditing = () => {
    if (userProfile) syncFormState(userProfile);
    setError('');
    setEditing(true);
  };

  const addInterest = () => {
    const tag = newInterest.trim();
    if (tag && !interests.includes(tag)) {
      setInterests([...interests, tag]);
    }
    setNewInterest('');
  };

  const removeInterest = (tag: string) => {
    setInterests(interests.filter((i) => i !== tag));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await profile.update({
        firstName,
        lastName,
        phone: phone || undefined,
        flatNumber: flatNumber || undefined,
        interests,
      });
      await loadProfile();
      setEditing(false);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to save profile'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Profile">
        <div className="flex items-center justify-center py-12">
          <p className="text-ink-secondary">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!userProfile) {
    return (
      <AppLayout title="Profile">
        <div className="text-center py-12">
          <p className="text-danger font-semibold">Could not load profile</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Profile"
      topAppBarActions={
        <button onClick={logout} className="text-xs font-semibold text-danger hover:text-danger">
          Logout
        </button>
      }
    >
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary-700 to-navy-950 px-6 pb-8 pt-6">
            <div
              className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div className="relative flex items-center gap-4">
              <Avatar
                initials={`${userProfile.first_name[0]}${userProfile.last_name[0]}`}
                size="lg"
                onDark
              />
              <div className="flex-1">
                <h2 className="font-display text-lg font-semibold text-white">
                  {userProfile.first_name} {userProfile.last_name}
                </h2>
                <p className="text-xs text-white/70">{userProfile.email}</p>
                {userProfile.admin_approved && (
                  <span className="mt-1.5 inline-block rounded-full bg-sage-bg px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-sage-text">
                    Verified Resident
                  </span>
                )}
                {userProfile.flat_number && !editing && (
                  <p className="text-xs text-white/60 mt-1">Flat {userProfile.flat_number}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
          {userProfile.trust_score !== undefined && (
            <TrustScoreBar score={userProfile.trust_score} size="md" />
          )}

          {error && (
            <div className="rounded-lg bg-danger-bg p-3 text-sm font-semibold text-danger">
              {error}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="border-t border-line pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                />
                <Input
                  label="Flat Number (optional)"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  placeholder="A-101"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Interests</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeInterest(tag)}
                      className="rounded-full bg-sage-bg px-3 py-1 text-xs font-semibold text-sage-text hover:opacity-70"
                    >
                      {tag} ✕
                    </button>
                  ))}
                  {interests.length === 0 && (
                    <p className="text-xs text-ink-tertiary">No interests yet</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-line bg-surface text-ink placeholder-ink-tertiary focus:border-primary focus:outline-none"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="Add an interest (e.g. pickleball)"
                  />
                  <Button type="button" variant="secondary" size="md" onClick={addInterest}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={saving} className="flex-1">
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="border-t border-line pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary mb-3">
                  Interests
                </p>
                {userProfile.interests.length === 0 ? (
                  <p className="text-xs text-ink-secondary">No interests added yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest) => (
                      <Badge key={interest} status="verified">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="primary" size="md" className="w-full" onClick={startEditing}>
                Edit Profile
              </Button>
            </>
          )}
          </div>
        </Card>

        <div className="space-y-4">
          <SectionHeader>Your Circles ({userCircles.length})</SectionHeader>

          {userCircles.length === 0 ? (
            <Card className="p-6 text-center space-y-1">
              <div className="text-2xl">🔵</div>
              <p className="text-sm font-semibold text-navy-950">No Circles yet</p>
              <p className="text-xs text-ink-tertiary">
                Browse the directory to find your people.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {userCircles.map((circle) => (
                <Link key={circle.id} to={`/circles/${circle.id}`}>
                  <Card className="p-5 transition-all hover:shadow-raised hover:-translate-y-0.5 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <IconTile
                        icon={getCategoryStyle(circle.category).icon}
                        color={getCategoryStyle(circle.category).color}
                        size="sm"
                      />
                      <div className="flex-1">
                        <h4 className="font-display font-semibold text-navy-950 mb-1">
                          {circle.name}
                        </h4>
                        <p className="text-xs text-ink-secondary mb-2 line-clamp-1">
                          {circle.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-ink-tertiary">
                          <span>{circle.category}</span>
                          {circle.meeting_schedule && <span>🕐 {circle.meeting_schedule}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
