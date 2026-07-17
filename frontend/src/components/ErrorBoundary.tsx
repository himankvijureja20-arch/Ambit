import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card } from './ui';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-app px-5">
          <Card className="p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="font-display text-lg font-semibold text-navy-950">
              Something went wrong
            </h2>
            <p className="text-sm text-ink-secondary">
              An unexpected error occurred. Try reloading the page.
            </p>
            <Button className="w-full" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
