import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/auth/AuthContext';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input, Textarea } from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { supportApi, toApiError } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

const schema = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(120),
  email: z.string().email('Enter a valid email'),
  message: z.string().trim().min(10, 'Tell us a little more').max(5000),
});
type Values = z.infer<typeof schema>;

export function ContactPage() {
  useDocumentTitle('Contact');
  const toast = useToast();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', message: '' },
  });

  const onSubmit = async (values: Values) => {
    try {
      await supportApi.contact(values);
      toast.success("Thanks — we'll be in touch.");
      reset({ name: values.name, email: values.email, message: '' });
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  };

  return (
    <Container className="py-12">
      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-[12px] text-ink-3">Contact</p>
          <h1 className="mt-3 text-h1 font-semibold text-ink">Say hello</h1>
          <p className="mt-3 max-w-prose text-ink-2">
            Questions, feedback, or want to list an event? Drop us a line and a real person will get back to you.
          </p>
          <ul className="mt-8 space-y-4 text-[14px] text-ink-2">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-ink-3" strokeWidth={1.75} /> hello@linemate.events
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-ink-3" strokeWidth={1.75} /> Bengaluru, India
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-line bg-paper-2 p-6" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field htmlFor="name" label="Name" error={errors.name?.message}>
              <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
            </Field>
            <Field htmlFor="email" label="Email" error={errors.email?.message}>
              <Input id="email" type="email" aria-invalid={Boolean(errors.email)} {...register('email')} />
            </Field>
          </div>
          <Field htmlFor="message" label="Message" error={errors.message?.message}>
            <Textarea id="message" rows={5} aria-invalid={Boolean(errors.message)} {...register('message')} />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>
              Send message
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
