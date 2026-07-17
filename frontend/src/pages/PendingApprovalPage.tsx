import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OnboardingLayout from '../layouts/OnboardingLayout';
import { Card } from '../components/ui';

const STEPS = [
  { label: 'Application received', done: true },
  { label: 'Admin review in progress', done: false },
  { label: 'Account activated', done: false },
];

export default function PendingApprovalPage() {
  const [dots, setDots] = useState('.');
  const navigate = useNavigate();

  // Animate ellipsis
  useEffect(() => {
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '.' : d + '.'));
    }, 600);
    return () => clearInterval(t);
  }, []);

  // Poll: check if the user got approved (they'll need to re-login to get a token)
  // For now, just navigate to login after showing the screen
  const handleCheckStatus = () => navigate('/login');

  return (
    <OnboardingLayout>
      <div className="animate-fadeIn space-y-6">
        {/* Hero */}
        <div className="text-center">
          <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 animate-ping rounded-full bg-primary/15" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl">
              ⏳
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-950">
            You're in the queue{dots}
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Your society admin is reviewing your application.
          </p>
        </div>

        {/* Progress steps */}
        <Card className="p-5 space-y-0">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold flex-shrink-0
                  ${step.done
                    ? 'bg-success text-white'
                    : i === 1
                      ? 'bg-primary/10 text-primary border-2 border-primary animate-pulse'
                      : 'bg-line-subtle text-ink-tertiary border-2 border-line'
                  }`}>
                  {step.done ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 ${step.done ? 'bg-success' : 'bg-line-subtle'}`} style={{ minHeight: 20 }} />
                )}
              </div>
              <div className="pb-4 pt-0.5">
                <p className={`text-sm font-semibold ${step.done ? 'text-success-text' : i === 1 ? 'text-ink' : 'text-ink-tertiary'}`}>
                  {step.label}
                </p>
                {i === 1 && (
                  <p className="mt-0.5 text-xs text-ink-tertiary">
                    Usually within 24 hours
                  </p>
                )}
              </div>
            </div>
          ))}
        </Card>

        {/* Info card */}
        <div className="rounded-xl bg-sage-bg/60 px-4 py-3 text-sm text-sage-text">
          <p className="font-semibold">What happens next?</p>
          <p className="mt-1 text-xs leading-relaxed">
            Once your admin approves your account, you'll receive access to log in and explore Circles and Requests in your society.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleCheckStatus}
            className="w-full rounded-xl border-2 border-primary bg-primary/5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            I've been approved — Log in
          </button>
          <Link
            to="/signup"
            className="block text-center text-sm text-ink-tertiary hover:text-ink-secondary"
          >
            ← Submitted by mistake? Start over
          </Link>
        </div>
      </div>
    </OnboardingLayout>
  );
}
