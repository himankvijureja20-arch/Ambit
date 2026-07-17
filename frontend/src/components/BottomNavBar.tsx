import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function BottomNavBar() {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/requests', label: 'Requests', icon: '📋' },
    { path: '/circles', label: 'Circles', icon: '🔵' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: '🛠️' }] : []),
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 px-5">
      <div className="mx-auto flex max-w-mobile items-center justify-around gap-0.5 rounded-full border border-line bg-surface/95 px-1.5 py-2 shadow-raised backdrop-blur">
        {navItems.map((item) => {
          const isActive =
            item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 text-[11px] font-semibold transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary scale-105'
                  : 'text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
