import { Bookmark, CalendarDays, LogOut, Plus, Settings, Ticket, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';

function Brand() {
  return (
    <Link to="/" className="inline-flex items-center gap-2" aria-label="Linemate — home">
      <span className="grid h-6 w-6 place-items-center rounded-sm bg-ink">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
      <span className="font-display text-[1.45rem] font-semibold tracking-tight text-ink">Linemate</span>
    </Link>
  );
}

function NavItem({ to, children }: { to: string; children: string }) {
  return (
    <NavLink to={to} className="text-[14px] text-ink-2 transition-colors hover:text-ink">
      {({ isActive }) => (
        <span data-active={isActive} className={cn('link-underline', isActive && 'text-ink')}>
          {children}
        </span>
      )}
    </NavLink>
  );
}

function MenuLink({
  to,
  icon: Icon,
  onClick,
  children,
}: {
  to: string;
  icon: LucideIcon;
  onClick: () => void;
  children: string;
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-[14px] text-ink-2 transition-colors hover:bg-ink/[0.05] hover:text-ink"
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {children}
    </Link>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = user?.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      toast.success('Signed out');
      navigate('/');
    } catch {
      toast.error('Could not sign out, please try again');
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[12px] font-semibold text-paper-2 transition-transform hover:scale-105"
      >
        {initials}
      </button>
      {open ? (
        <div
          role="menu"
          className="animate-rise-in absolute right-0 mt-2 w-60 overflow-hidden rounded-md border border-line bg-paper-2 shadow-paper-2"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-[14px] font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-[12px] text-ink-3">{user?.email}</p>
          </div>
          <nav className="py-1">
            <MenuLink to="/bookings" icon={Ticket} onClick={() => setOpen(false)}>
              My Tickets
            </MenuLink>
            <MenuLink to="/saved" icon={Bookmark} onClick={() => setOpen(false)}>
              Saved events
            </MenuLink>
            <MenuLink to="/events/new" icon={Plus} onClick={() => setOpen(false)}>
              Create event
            </MenuLink>
            <MenuLink to="/events/mine" icon={CalendarDays} onClick={() => setOpen(false)}>
              My events
            </MenuLink>
            <MenuLink to="/settings" icon={Settings} onClick={() => setOpen(false)}>
              Settings
            </MenuLink>
          </nav>
          <div className="border-t border-line py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-[14px] text-ink-2 transition-colors hover:bg-ink/[0.05] hover:text-ink"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-8">
          <Brand />
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <NavItem to="/events">Events</NavItem>
            <NavItem to="/about">About</NavItem>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="ml-1 text-[14px] text-ink-2 transition-colors hover:text-ink">
                <span className="link-underline">Sign in</span>
              </Link>
              <Link to="/register" className="hidden sm:inline-flex">
                <Button size="sm">Get a ticket</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
