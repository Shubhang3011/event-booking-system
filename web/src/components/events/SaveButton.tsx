import { Bookmark } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { useToggleSave } from '@/hooks/useSaved';
import { toApiError } from '@/lib/api';
import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';

interface SaveButtonProps {
  eventId: string;
  variant?: 'icon' | 'labelled';
  className?: string;
}

export function SaveButton({ eventId, variant = 'icon', className }: SaveButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const toggle = useToggleSave();
  const saved = Boolean(user?.savedEvents?.includes(eventId));

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${eventId}` } });
      return;
    }
    toggle.mutate(
      { id: eventId, saved },
      {
        onError: (err) => toast.error(toApiError(err).message),
        onSuccess: () => toast.success(saved ? 'Removed from saved' : 'Saved to your list'),
      },
    );
  };

  if (variant === 'labelled') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          'inline-flex h-11 items-center gap-2 rounded-sm border px-4 text-[14px] font-semibold transition-colors',
          saved
            ? 'border-accent bg-accent-wash text-accent-press'
            : 'border-line bg-paper-2 text-ink-2 hover:border-ink hover:text-ink',
          className,
        )}
      >
        <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} strokeWidth={1.75} />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save event'}
      title={saved ? 'Saved' : 'Save'}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full border backdrop-blur-sm transition-colors',
        saved
          ? 'border-accent bg-accent-wash text-accent-press'
          : 'border-line bg-paper-2/85 text-ink-2 hover:border-ink hover:text-ink',
        className,
      )}
    >
      <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} strokeWidth={1.75} />
    </button>
  );
}
