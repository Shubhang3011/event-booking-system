import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/auth/AuthContext';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { authApi, toApiError } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { User } from '@/lib/types';
import { useTheme, type Theme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

function SettingsSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-10 md:grid-cols-[1fr_1.6fr]">
      <div>
        <h2 className="font-display text-h2 font-medium text-ink">{title}</h2>
        <p className="mt-1 max-w-[36ch] text-[14px] text-ink-2">{description}</p>
      </div>
      <div className="rounded-md border border-line bg-paper-2 p-6">{children}</div>
    </section>
  );
}

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

function Appearance() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">Theme</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={theme === value}
            className={cn(
              'flex flex-col items-center gap-2 rounded-md border px-3 py-4 transition-colors',
              theme === value
                ? 'border-ink bg-paper-3 text-ink'
                : 'border-line text-ink-2 hover:border-line-strong hover:text-ink',
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.6} />
            <span className="text-[13px] font-medium">{label}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-ink-3">“System” follows your device’s light/dark setting.</p>
    </div>
  );
}

const profileSchema = z.object({ name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80) });
type ProfileValues = z.infer<typeof profileSchema>;

function ProfileForm() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name ?? '' } });

  const onSubmit = async (values: ProfileValues) => {
    try {
      const updated = await authApi.updateProfile(values);
      qc.setQueryData<User | null>(['me'], updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field htmlFor="name" label="Name" error={errors.name?.message}>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
      </Field>
      <Field htmlFor="email" label="Email">
        <Input id="email" value={user?.email ?? ''} disabled readOnly />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z.string().min(8, 'Use at least 8 characters').max(100),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

function PasswordForm() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values: PasswordValues) => {
    try {
      await authApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      toast.success('Password changed');
      reset();
    } catch (err) {
      const e = toApiError(err);
      if (e.status === 400) setError('currentPassword', { message: e.message });
      else toast.error(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field htmlFor="currentPassword" label="Current password" error={errors.currentPassword?.message}>
        <Input id="currentPassword" type="password" autoComplete="current-password" {...register('currentPassword')} />
      </Field>
      <Field htmlFor="newPassword" label="New password" error={errors.newPassword?.message}>
        <Input id="newPassword" type="password" autoComplete="new-password" {...register('newPassword')} />
      </Field>
      <Field htmlFor="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}>
        <Input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Update password
        </Button>
      </div>
    </form>
  );
}

export function SettingsPage() {
  useDocumentTitle('Settings');
  return (
    <Container className="py-12">
      <h1 className="font-display text-h1 font-medium text-ink">Settings</h1>
      <p className="mt-1 text-ink-2">Manage your appearance and account.</p>

      <div className="mt-6">
        <SettingsSection title="Appearance" description="Choose how Linemate looks. Dark mode is easy on the eyes at night.">
          <Appearance />
        </SettingsSection>
        <SettingsSection title="Profile" description="Update the name shown on your account.">
          <ProfileForm />
        </SettingsSection>
        <SettingsSection title="Password" description="Change your password. You’ll stay signed in on this device.">
          <PasswordForm />
        </SettingsSection>
      </div>
    </Container>
  );
}
