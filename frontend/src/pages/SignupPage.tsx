import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../api/client';
import OnboardingLayout from '../layouts/OnboardingLayout';
import { Button, Input, Card } from '../components/ui';

type Step = 'code' | 'details';

export default function SignupPage() {
  const [step, setStep] = useState<Step>('code');
  const [inviteCode, setInviteCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleCodeContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setError('');
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password, firstName, lastName, inviteCode);
      navigate('/pending-approval');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Signup failed. Check your invite code and try again.'));
    }
  };

  return (
    <OnboardingLayout>
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <div className={`h-2 w-8 rounded-full transition-all ${step === 'code' ? 'bg-primary' : 'bg-primary'}`} />
        <div className={`h-2 w-8 rounded-full transition-all ${step === 'details' ? 'bg-primary' : 'bg-line'}`} />
      </div>

      {/* ── Step 1: Society Code ── */}
      {step === 'code' && (
        <div className="animate-fadeIn space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              🏘️
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-950">Welcome to Ambit</h1>
            <p className="mt-2 text-sm text-ink-secondary">
              Enter your society's invite code to get started
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-danger-bg p-3 text-sm font-semibold text-danger">{error}</div>
          )}

          <Card className="p-6">
            <form onSubmit={handleCodeContinue} className="space-y-4">
              <Input
                label="Society Invite Code"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. GREENPARK2024"
                autoFocus
                required
              />
              <p className="text-xs text-ink-tertiary">
                Your society admin should have shared this code with residents.
              </p>
              <Button type="submit" size="lg" className="w-full">
                Continue →
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-ink-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-600">
              Log in
            </Link>
          </p>
        </div>
      )}

      {/* ── Step 2: Personal Details ── */}
      {step === 'details' && (
        <div className="animate-fadeIn space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              👋
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-950">Tell us about you</h1>
            <p className="mt-2 text-sm text-ink-secondary">
              Your details help neighbors recognize you
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-danger-bg p-3 text-sm font-semibold text-danger">{error}</div>
          )}

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Priya"
                  required
                  autoFocus
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />

              <Input
                label="Flat / Unit Number"
                type="text"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                placeholder="B-404"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <p className="text-xs text-ink-tertiary">
                🔒 Verified residents only — your details keep the community safe.
              </p>

              <Button type="submit" loading={loading} size="lg" className="w-full">
                Submit for Approval
              </Button>
            </form>
          </Card>

          <button
            type="button"
            onClick={() => { setStep('code'); setError(''); }}
            className="mx-auto flex items-center gap-1 text-sm text-ink-tertiary hover:text-ink-secondary"
          >
            ← Change invite code
          </button>
        </div>
      )}
    </OnboardingLayout>
  );
}
