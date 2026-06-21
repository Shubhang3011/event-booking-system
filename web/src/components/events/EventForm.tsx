import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input, Select, Textarea } from '@/components/ui/Input';
import type { EventInput } from '@/lib/api';
import { EVENT_CATEGORIES } from '@/lib/types';

const schema = z.object({
  title: z.string().trim().min(3, 'Title is too short').max(140),
  description: z.string().trim().min(10, 'Add a little more detail').max(5000),
  date: z.string().min(1, 'Pick a date and time'),
  venue: z.string().trim().min(2, 'Required').max(160),
  city: z.string().trim().min(2, 'Required').max(80),
  category: z.enum(EVENT_CATEGORIES),
  organizer: z.string().trim().min(2, 'Required').max(120),
  totalSeats: z.coerce.number().int('Whole number').min(1, 'At least 1').max(100000),
});
type FormValues = z.infer<typeof schema>;

interface EventFormProps {
  defaultValues?: Partial<FormValues>;
  submitLabel: string;
  onSubmit: (values: EventInput) => Promise<void>;
}

export function EventForm({ defaultValues, submitLabel, onSubmit }: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'Music', totalSeats: 100, ...defaultValues },
  });

  const submit = async (v: FormValues) => {
    // datetime-local gives local time; send an ISO string to the API.
    await onSubmit({ ...v, date: new Date(v.date).toISOString() });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <Field htmlFor="title" label="Title" error={errors.title?.message}>
        <Input id="title" placeholder="Late Night Jazz: The Blue Hour" aria-invalid={Boolean(errors.title)} {...register('title')} />
      </Field>
      <Field htmlFor="description" label="Description" error={errors.description?.message}>
        <Textarea id="description" rows={4} placeholder="What's the night about?" aria-invalid={Boolean(errors.description)} {...register('description')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field htmlFor="date" label="Date & time" error={errors.date?.message}>
          <Input id="date" type="datetime-local" aria-invalid={Boolean(errors.date)} {...register('date')} />
        </Field>
        <Field htmlFor="category" label="Category" error={errors.category?.message}>
          <Select id="category" {...register('category')}>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field htmlFor="venue" label="Venue" error={errors.venue?.message}>
          <Input id="venue" placeholder="BFlat Bar, Indiranagar" aria-invalid={Boolean(errors.venue)} {...register('venue')} />
        </Field>
        <Field htmlFor="city" label="City" error={errors.city?.message}>
          <Input id="city" placeholder="Bengaluru" aria-invalid={Boolean(errors.city)} {...register('city')} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field htmlFor="organizer" label="Organizer" error={errors.organizer?.message}>
          <Input id="organizer" placeholder="Blue Hour Collective" aria-invalid={Boolean(errors.organizer)} {...register('organizer')} />
        </Field>
        <Field htmlFor="totalSeats" label="Total seats" error={errors.totalSeats?.message}>
          <Input id="totalSeats" type="number" min={1} aria-invalid={Boolean(errors.totalSeats)} {...register('totalSeats')} />
        </Field>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
