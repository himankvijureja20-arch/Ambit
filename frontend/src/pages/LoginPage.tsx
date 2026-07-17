import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../api/client';
import OnboardingLayout from '../layouts/OnboardingLayout';
import { Button, Input, Card } from '../components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Invalid email or password'));
    }
  };

  return (
    <OnboardingLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-navy-950 leading-tight">
            Find your people,<br />right where you live.
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Sign in to connect with neighbors who share your interests
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-danger-bg p-3 text-sm font-semibold text-danger">
            {error}
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button type="submit" loading={loading} size="lg" className="w-full">
              Log In
            </Button>
          </form>
        </Card>

        <div className="space-y-3 text-center">
          <p className="text-sm text-ink-secondary">
            New to Ambit?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-600">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-ink-tertiary">
            🔒 Verified residents only — you need a society invite code to join.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
