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
          <rect x="0"   y="7"   width="3" height="4"  rx="0.8" fill="#2D3A34" />
          <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.8" fill="#2D3A34" />
          <rect x="9"   y="2"   width="3" height="9"  rx="0.8" fill="#2D3A34" />
          <rect x="13.5" y="0"  width="3" height="11" rx="0.8" fill="#2D3A34" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" fill="#2D3A34"/>
          <path d="M4.5 6.8a4.9 4.9 0 0 1 7 0" stroke="#2D3A34" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          <path d="M1.5 3.9A9.1 9.1 0 0 1 14.5 3.9" stroke="#2D3A34" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#2D3A34" strokeOpacity="0.35"/>
          <rect x="2"   y="2"   width="20" height="9"  rx="2"   fill="#2D3A34"/>
          <path d="M25 4.5v4a2.2 2.2 0 0 0 0-4z" fill="#2D3A34" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <>
      {/* ── Real mobile device: no frame, normal layout ── */}
      <div className="sm:hidden">{children}</div>

      {/* ── Desktop: centered phone frame ── */}
      <div className="hidden sm:flex min-h-screen frame-bg items-start justify-center py-8 px-4">
        <div
          className="relative flex-shrink-0"
          style={{
            width: 375,
            height: 812,
            borderRadius: 50,
            border: '10px solid #1F2E28',
            background: '#F1F5F0',
            overflow: 'hidden',
            boxShadow:
              '0 30px 60px rgba(31,46,40,0.4), 0 0 0 1px rgba(31,46,40,0.1), inset 0 0 0 1px rgba(255,255,255,0.06)',
            /*
             * transform creates a new stacking context + containing block
             * for position:fixed descendants — this "traps" the nav bar
             * and any other fixed elements inside the phone frame.
             */
            transform: 'translateZ(0)',
          }}
        >
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
              background: '#1F2E28',
            }}
          />

          {/* Status bar */}
          <StatusBar />

          {/*
           * Scrollable content area.
           * Sits below the 44px status bar and fills the rest of the frame.
           * This is the single scroll container for all page content.
           */}
          <div
            className="scrollbar-hide"
            style={{
              position: 'absolute',
              top: 44,
              left: 0,
              right: 0,
              bottom: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {children}
          </div>

          {/* Home indicator */}
          <div
            className="pointer-events-none absolute bottom-1.5 left-0 right-0 flex justify-center"
            style={{ zIndex: 60 }}
          >
            <div
              style={{
                width: 120,
                height: 5,
                borderRadius: 10,
                background: '#2D3A34',
                opacity: 0.2,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
