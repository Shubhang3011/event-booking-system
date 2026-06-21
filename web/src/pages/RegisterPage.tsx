import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/auth/AuthContext';
import { AuthShell, AuthSwitch } from '@/components/layout/AuthShell';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { toApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

const schema = z.object({
  name: z.string().min(2, 'Tell us your name').max(80),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters').max(100),
});
type Values = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '' } });

  if (isAuthenticated) return <Navigate to="/events" replace />;

  const onSubmit = async (values: Values) => {
    try {
      await registerUser(values);
      toast.success('Account created — welcome to Linemate');
      navigate('/events', { replace: true });
    } catch (err) {
      const e = toApiError(err);
      if (e.status === 409) {
        setError('email', { message: 'That email is already registered' });
      }
      toast.error(e.message);
    }
  };

  return (
    <AuthShell
      heading="Find your"
      kicker="people."
      manifesto="Create an account to book seats, keep your tickets in one place, and never miss a night out."
    >
      <div className="mx-auto w-full max-w-sm">
        <AuthSwitch active="register" />
        <h2 className="mt-6 font-display text-h1 font-medium text-ink">Create your account</h2>
        <p className="mt-1 text-[14px] text-ink-2">It takes about ten seconds.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <Field htmlFor="name" label="Name" error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </Field>
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
          <Field htmlFor="password" label="Password" error={errors.password?.message} hint="At least 8 characters.">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
          </Field>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-[14px] text-ink-2">
          Already have an account?{' '}
          <Link to="/login" className="link-underline text-ink">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
