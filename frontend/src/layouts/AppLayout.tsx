import { ReactNode } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  topAppBarActions?: ReactNode;
  backTo?: string;
}

export default function AppLayout({
  children,
  title,
  topAppBarActions,
  backTo,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen sm:min-h-full flex-col bg-app">
      <TopAppBar title={title} actions={topAppBarActions} backTo={backTo} />
      {/*
       * On mobile (real device): overflow-y-auto so this element scrolls.
       * On desktop (inside the phone frame): no overflow — the MobileFrame's
       * content area is the single scroll container; this just expands freely.
       */}
      <main className="flex-1 overflow-y-auto sm:overflow-visible pb-28">
        <div className="mx-auto max-w-mobile px-5 py-6">
          {children}
        </div>
      </main>
      <BottomNavBar />
    </div>
  );
}
