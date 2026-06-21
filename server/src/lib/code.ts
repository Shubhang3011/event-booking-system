import { randomBytes } from 'node:crypto';

// Unambiguous alphabet (no 0/O/1/I) for human-friendly booking references.
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Generate a ticket-style booking reference, e.g. "LM-7Q4K9P". */
export function generateBookingCode(): string {
  const bytes = randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += ALPHABET[bytes[i]! % ALPHABET.length]!;
  }
  return `LM-${code}`;
}
