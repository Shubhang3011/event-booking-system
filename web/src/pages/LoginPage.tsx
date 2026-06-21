import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/auth/AuthContext';
import { AuthShell, AuthSwitch } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { toApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type Values = z.infer<typeof schema>;

export function LoginPage() {
  useDocumentTitle('Sign in');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const from = (location.state as { from?: string } | null)?.from ?? '/events';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = async (values: Values) => {
    try {
      await login(values);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  const useDemo = () => {
    setValue('email', 'demo@linemate.events');
    setValue('password', 'password123');
  };

  return (
    <AuthShell
      heading="Welcome to the"
      kicker="bill."
      manifesto="Reserve seats to the city's best nights — gigs, talks, dinners and everything in between."
    >
      <div className="mx-auto w-full max-w-sm">
        <AuthSwitch active="login" />
        <h2 className="mt-6 font-display text-h1 font-medium text-ink">Good to see you</h2>
        <p className="mt-1 text-[14px] text-ink-2">Sign in to manage your tickets.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <Field htmlFor="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </Field>
          <Field htmlFor="password" label="Password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
          </Field>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <button
          type="button"
          onClick={useDemo}
          className="mt-3 w-full rounded-sm border border-dashed border-line-strong py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-2 transition-colors hover:border-ink hover:text-ink"
        >
          Use demo credentials
        </button>

        <p className="mt-6 text-[14px] text-ink-2">
          New here?{' '}
          <Link to="/register" className="link-underline text-ink">
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
