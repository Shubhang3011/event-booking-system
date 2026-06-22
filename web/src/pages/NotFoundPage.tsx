import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export function NotFoundPage() {
  return (
    <Container className="grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="text-[12px] text-ink-3">Error 404</p>
        <h1 className="mt-3 text-display-xl font-bold text-ink">
          Off the <span className="text-accent">guest list.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-body-lg text-ink-2">
          We couldn't find that page. It may have moved, sold out, or never existed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/events">
            <Button>Browse events</Button>
          </Link>
          <Link to="/" className="link-underline text-[14px] text-ink-2">
            Back home
          </Link>
        </div>
      </div>
    </Container>
  );
}
