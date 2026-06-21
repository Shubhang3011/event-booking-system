import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const KEY = 'cookie-consent';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, 'accepted');
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper-2/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-content flex-col items-start gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
        <p className="max-w-prose text-[13px] text-ink-2">
          We use a single essential cookie to keep you signed in. By using Linemate you agree to our{' '}
          <Link to="/privacy" className="link-underline text-ink">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <Link to="/privacy" className="text-[13px] text-ink-2 transition-colors hover:text-ink">
            <span className="link-underline">Learn more</span>
          </Link>
          <Button size="sm" onClick={accept}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
