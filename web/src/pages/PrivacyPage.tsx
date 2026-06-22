import { Container } from '@/components/layout/Container';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SECTIONS = [
  ['What we collect', 'We store the name and email you provide, your bookings, the events you save, and any reviews you write. Passwords are stored only as a secure bcrypt hash — never in plain text.'],
  ['Cookies', 'We use one essential, httpOnly cookie to keep you signed in. It cannot be read by JavaScript and is not used for advertising or cross-site tracking.'],
  ['How we use your data', 'Your data is used solely to operate the service — to authenticate you, show your bookings and saved events, and display your reviews. We do not sell your data.'],
  ['Your choices', 'You can update your name and password, remove saved events, delete your reviews, and cancel bookings at any time from your account.'],
  ['Data retention', 'We keep your account data while your account exists. As a demo application, data may be reset periodically.'],
  ['Contact', 'Questions about privacy? Reach us via the Contact page.'],
] as const;

export function PrivacyPage() {
  useDocumentTitle('Privacy Policy');
  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-[12px] text-ink-3">Legal</p>
        <h1 className="mt-3 text-h1 font-semibold text-ink">Privacy Policy</h1>
        <p className="mt-2 text-[13px] text-ink-3">Last updated: June 2026</p>
        <div className="mt-8 space-y-8">
          {SECTIONS.map(([title, body]) => (
            <section key={title}>
              <h2 className="text-[1.3rem] font-medium text-ink">{title}</h2>
              <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-2">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
