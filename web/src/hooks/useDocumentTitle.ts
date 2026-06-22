import { useEffect } from 'react';

const BASE = 'Linemate';
const DEFAULT = `${BASE} — Discover & book events`;

/** Set the document title for a page (e.g. "Events · Linemate"). */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : DEFAULT;
    return () => {
      document.title = DEFAULT;
    };
  }, [title]);
}
