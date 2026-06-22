import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

let cached: Transporter | null | undefined;

/** Lazily build a transport; returns null when SMTP isn't configured. */
function getTransporter(): Transporter | null {
  if (cached !== undefined) return cached;
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    cached = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  } else {
    cached = null;
  }
  return cached;
}

export interface BookingEmail {
  to: string;
  name: string;
  eventTitle: string;
  when: string;
  venue: string;
  seats: number;
  code: string;
}

/**
 * Send a booking confirmation email. If SMTP isn't configured, it logs instead
 * of sending — so the feature works end-to-end without external credentials and
 * never blocks or fails a booking.
 */
export async function sendBookingConfirmation(b: BookingEmail): Promise<void> {
  const subject = `You're going to ${b.eventTitle}`;
  const text =
    `Hi ${b.name},\n\nYour booking is confirmed.\n\n` +
    `Event: ${b.eventTitle}\nWhen:  ${b.when}\nWhere: ${b.venue}\n` +
    `Seats: ${b.seats}\nBooking code: ${b.code}\n\n` +
    `See your tickets in your account at Linemate.\n`;
  const html =
    `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;color:#1a1714">` +
    `<h2 style="margin:0 0 8px">You're going to ${b.eventTitle} 🎟️</h2>` +
    `<p style="color:#534e45">Hi ${b.name}, your booking is confirmed.</p>` +
    `<table style="font-size:14px;color:#1a1714">` +
    `<tr><td style="padding:2px 12px 2px 0;color:#8a8475">When</td><td>${b.when}</td></tr>` +
    `<tr><td style="padding:2px 12px 2px 0;color:#8a8475">Where</td><td>${b.venue}</td></tr>` +
    `<tr><td style="padding:2px 12px 2px 0;color:#8a8475">Seats</td><td>${b.seats}</td></tr>` +
    `</table>` +
    `<p style="margin-top:12px">Booking code: <strong>${b.code}</strong></p></div>`;

  const transporter = getTransporter();
  if (!transporter) {
    logger.info(`[email] SMTP not configured — would email "${subject}" to ${b.to} (code ${b.code})`);
    return;
  }
  try {
    await transporter.sendMail({ from: env.EMAIL_FROM || env.SMTP_USER, to: b.to, subject, text, html });
    logger.info(`[email] Sent booking confirmation to ${b.to}`);
  } catch (err) {
    logger.error('[email] Failed to send booking confirmation', err);
  }
}
