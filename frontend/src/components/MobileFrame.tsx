import { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
}

function StatusBar() {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6"
      style={{ height: 44, paddingTop: 12 }}
    >
      <span className="text-[13px] font-semibold text-ink">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0"   y="7"   width="3" height="4"  rx="0.8" fill="#312E81" />
          <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.8" fill="#312E81" />
          <rect x="9"   y="2"   width="3" height="9"  rx="0.8" fill="#312E81" />
          <rect x="13.5" y="0"  width="3" height="11" rx="0.8" fill="#312E81" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" fill="#312E81"/>
          <path d="M4.5 6.8a4.9 4.9 0 0 1 7 0" stroke="#312E81" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          <path d="M1.5 3.9A9.1 9.1 0 0 1 14.5 3.9" stroke="#312E81" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#312E81" strokeOpacity="0.35"/>
          <rect x="2"   y="2"   width="20" height="9"  rx="2"   fill="#312E81"/>
          <path d="M25 4.5v4a2.2 2.2 0 0 0 0-4z" fill="#312E81" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

/*
 * Renders children exactly ONCE. On real phones (<sm) the frame classes are
 * inert and the app fills the viewport; on desktop (≥sm) the same DOM is
 * dressed in a phone mockup via .phone-frame / .phone-screen (index.css).
 * Never render children twice here — a second copy mounts a second Router
 * and duplicates every API call.
 */
export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="sm:min-h-screen sm:frame-bg sm:flex sm:items-start sm:justify-center sm:py-8 sm:px-4">
      <div className="relative sm:flex-shrink-0 phone-frame">
        {/* Desktop-only phone chrome */}
        <div className="hidden sm:block">
          {/* Dynamic Island */}
          <div
            className="pointer-events-none absolute z-50"
            style={{
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 30,
              borderRadius: 20,
              background: '#1E1B4B',
            }}
          />
          <StatusBar />
        </div>

        {/* Single app instance; scrolls inside the frame on desktop */}
        <div className="phone-screen scrollbar-hide">{children}</div>

        {/* Home indicator (desktop only) */}
        <div
          className="pointer-events-none absolute bottom-1.5 left-0 right-0 hidden sm:flex justify-center"
          style={{ zIndex: 60 }}
        >
          <div
            style={{
              width: 120,
              height: 5,
              borderRadius: 10,
              background: '#312E81',
              opacity: 0.2,
            }}
          />
        </div>
      </div>
    </div>
  );
}
