import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-app px-5">
      <Card className="p-6 max-w-sm w-full text-center space-y-4">
        <div className="text-4xl">🧭</div>
        <h2 className="font-display text-lg font-semibold text-navy-950">Page not found</h2>
        <p className="text-sm text-ink-secondary">
          This page doesn't exist, or you may not have access to it.
        </p>
        <Link to="/">
          <Button className="w-full">Back to Home</Button>
        </Link>
      </Card>
    </div>
  );
}
