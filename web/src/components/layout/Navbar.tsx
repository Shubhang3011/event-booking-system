import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/Button';
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

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [signingOut, setSigningOut] = useState(false);

  const initials = user?.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
      toast.success('Signed out');
      navigate('/');
    } catch {
      toast.error('Could not sign out, please try again');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-8">
          <Brand />
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <NavItem to="/events">Events</NavItem>
            {isAuthenticated ? <NavItem to="/bookings">My Tickets</NavItem> : null}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden items-center gap-2 md:flex">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[12px] font-semibold text-paper-2">
                  {initials}
                </span>
                <span className="text-[13px] text-ink-2">{user?.name}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={signingOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[14px] text-ink-2 transition-colors hover:text-ink">
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
