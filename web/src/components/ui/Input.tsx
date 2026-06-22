import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const controlBase =
  'w-full rounded-lg border border-line bg-paper-2 px-3.5 text-[15px] text-ink placeholder:text-ink-3 transition-colors duration-150 ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/30 disabled:opacity-60';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlBase, 'h-11', className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(controlBase, 'min-h-[88px] py-2.5', className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(controlBase, 'h-11 cursor-pointer appearance-none pr-9', className)} {...props}>
        {children}
      </select>
    );
  },
);
