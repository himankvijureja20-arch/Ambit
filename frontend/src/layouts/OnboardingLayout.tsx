import { ReactNode } from 'react';
import Logo from '../components/brand/Logo';

interface OnboardingLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
}

export default function OnboardingLayout({
  children,
  showLogo = true,
}: OnboardingLayoutProps) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-app px-5 py-10"
      style={{
        backgroundImage:
          'radial-gradient(circle at 15% -10%, rgba(200,90,58,0.09), transparent 55%), radial-gradient(circle at 110% 10%, rgba(107,165,135,0.08), transparent 45%)',
      }}
    >
      {showLogo && (
        <div className="mb-12 animate-fadeIn">
          <Logo size={32} withTile />
        </div>
      )}
      <div className="w-full max-w-sm animate-fadeIn">
        {children}
      </div>
    </div>
  );
}
