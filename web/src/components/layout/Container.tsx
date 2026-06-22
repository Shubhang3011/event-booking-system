import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Centered page column: max 1200px, 16px → 64px responsive gutters. */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-content px-4 sm:px-6 md:px-10 lg:px-16', className)}>{children}</Tag>
  );
}
