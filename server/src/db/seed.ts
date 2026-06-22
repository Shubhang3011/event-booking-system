import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { logger } from '../lib/logger';
import { Booking } from '../modules/bookings/booking.model';
import { Event, type EventCategory } from '../modules/events/event.model';
import { Review } from '../modules/reviews/review.model';
import { User } from '../modules/users/user.model';
import { connectDatabase, disconnectDatabase } from './connect';

/** Demo account, advertised in the README so reviewers can sign in instantly. */
export const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@linemate.events',
  password: 'password123',
};

/** Build a Date `days` from now at a fixed local time (stable per run). */
function at(days: number, hour = 19, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

interface EventSeed {
  title: string;
  description: string;
  date: Date;
  venue: string;
  city: string;
  category: EventCategory;
  organizer: string;
  totalSeats: number;
  availableSeats: number;
}

const events: EventSeed[] = [
  {
    title: 'Late Night Jazz: The Blue Hour',
    description:
      'A standing-room session of after-dark jazz — brushed drums, a stand-up bass and a horn section that does not stop until the lights come up. Doors at nine, first set at half past.',
    date: at(3, 21, 30),
    venue: 'BFlat Bar, Indiranagar',
    city: 'Bengaluru',
    category: 'Music',
    organizer: 'Blue Hour Collective',
    totalSeats: 140,
    availableSeats: 31,
  },
  {
    title: 'Founders Friday: Pitch Night',
    description:
      'Eight early-stage founders, five minutes each, one room full of operators and angels. Stay for the cold drinks and the warm introductions afterwards.',
    date: at(4, 18, 0),
    venue: 'Church Street Social',
    city: 'Bengaluru',
    category: 'Business',
    organizer: 'Stealth Capital',
    totalSeats: 90,
    availableSeats: 0, // sold out — exercises the "sold out" state
  },
  {
    title: 'Sonar Nights: Bassline Sessions',
    description:
      'A warehouse night built around a wall of sound. Three back-to-back sets, resident selectors, and a room engineered for low end. Eighteen-plus, bring ID.',
    date: at(6, 21, 0),
    venue: 'Famous Studios, Mahalaxmi',
    city: 'Mumbai',
    category: 'Music',
    organizer: 'Sonar Collective',
    totalSeats: 300,
    availableSeats: 42,
  },
  {
    title: 'Comedy Cellar: Open Mic Finals',
    description:
      'Twelve comics who survived the heats go head to head for the season title. Unfiltered, unpredictable, and occasionally brilliant. Heckling is part of the deal.',
    date: at(7, 20, 30),
    venue: 'Heart Cup Cafe',
    city: 'Hyderabad',
    category: 'Community',
    organizer: 'Mic Drop',
    totalSeats: 110,
    availableSeats: 9, // few left
  },
  {
    title: 'Sunrise Vinyasa & Sound Bath',
    description:
      'An hour of slow-flow vinyasa on the riverbank as the valley wakes up, closing with a thirty-minute sound bath. Mats and chai provided. Come as you are.',
    date: at(9, 6, 0),
    venue: 'Aloha Riverside',
    city: 'Rishikesh',
    category: 'Wellness',
    organizer: 'Stillpoint',
    totalSeats: 60,
    availableSeats: 22,
  },
  {
    title: 'The Long Table: A Coastal Feast',
    description:
      'One long table on the sand, seven courses of Goan coastal cooking, and a sommelier pairing local and natural wines. Sunset seating, limited covers.',
    date: at(12, 19, 30),
    venue: 'Vagator Beach',
    city: 'Goa',
    category: 'Food & Drink',
    organizer: 'Hosa Hospitality',
    totalSeats: 120,
    availableSeats: 8, // few left
  },
  {
    title: 'Hamlet, Reimagined',
    description:
      'A stripped-back, ninety-minute Hamlet staged in the round, with a live score and a cast of six. The Prince of Denmark, closer than you have ever sat to him.',
    date: at(15, 19, 0),
    venue: 'Kamani Auditorium',
    city: 'New Delhi',
    category: 'Theatre',
    organizer: 'Antargni Theatre',
    totalSeats: 480,
    availableSeats: 64,
  },
  {
    title: "Indie Premiere: 'Monsoon Letters'",
    description:
      'The festival-circuit premiere of a quiet, luminous debut feature, followed by a director Q&A and a short reception. Subtitled. Shot entirely on 16mm.',
    date: at(18, 20, 0),
    venue: 'Nandan Cinema',
    city: 'Kolkata',
    category: 'Arts',
    organizer: 'Cinephile Society',
    totalSeats: 320,
    availableSeats: 175,
  },
  {
    title: 'Kolam: Contemporary South Indian Art',
    description:
      'A guided opening of a new group show tracing the line from temple-floor kolam to contemporary abstraction. Twenty-two artists, one afternoon, with the curators.',
    date: at(20, 11, 0),
    venue: 'DakshinaChitra Museum',
    city: 'Chennai',
    category: 'Arts',
    organizer: 'Forma Arts',
    totalSeats: 250,
    availableSeats: 130,
  },
  {
    title: 'Jaipur Design Week: Type & Print',
    description:
      'A hands-on day inside the printing room — wood type, letterpress and risograph — closing with a talk on Devanagari type design. Take home what you set.',
    date: at(28, 10, 0),
    venue: 'Jawahar Kala Kendra',
    city: 'Jaipur',
    category: 'Arts',
    organizer: 'JDW Collective',
    totalSeats: 400,
    availableSeats: 268,
  },
  {
    title: 'React India 2026',
    description:
      "The country's largest React conference returns: two tracks, thirty speakers, and a hallway full of the people building the modern web. Lunch and after-party included.",
    date: at(34, 9, 30),
    venue: 'Grand Hyatt, Bambolim',
    city: 'Goa',
    category: 'Technology',
    organizer: 'React India',
    totalSeats: 800,
    availableSeats: 215,
  },
  {
    title: 'Half Marathon: Deccan Dawn Run',
    description:
      'A 21.1km point-to-point through the old city at first light, chip-timed, with hydration stations every three kilometres and a finish-line breakfast. All paces welcome.',
    date: at(45, 5, 30),
    venue: 'Sinhagad Road',
    city: 'Pune',
    category: 'Sports',
    organizer: 'Pacemakers Pune',
    totalSeats: 2000,
    availableSeats: 940,
  },
  {
    title: 'NH7 Weekender — Recap Screening',
    description:
      'A big-screen recap of last season, on the lawns, with food trucks and a guest DJ. A past event, kept here so you can see how concluded events are handled.',
    date: at(-10, 19, 0),
    venue: 'Mahalaxmi Lawns',
    city: 'Pune',
    category: 'Music',
    organizer: 'OML',
    totalSeats: 500,
    availableSeats: 500,
  },
];

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

// Cover images (Unsplash), aligned to the events array above by index.
const EVENT_IMAGES = [
  img('photo-1511192336575-5a79af67a629'), // jazz
  img('photo-1556761175-5973dc0f32e7'), // pitch night
  img('photo-1470229722913-7c0e2dbbafd3'), // concert crowd
  img('photo-1527224538127-2104bb71c51b'), // comedy mic
  img('photo-1506126613408-eca07ce68773'), // yoga
  img('photo-1414235077428-338989a2e8c0'), // coastal feast
  img('photo-1503095396549-807759245b35'), // theatre
  img('photo-1489599849927-2ee91cede3ba'), // cinema
  img('photo-1531058020387-3be344556be6'), // art gallery
  img('photo-1452860606245-08befc0ff44b'), // design / print
  img('photo-1540575467063-178a50c2df87'), // conference
  img('photo-1452626038306-9aae5e071dd3'), // running
  img('photo-1459749411175-04bf5292ceea'), // festival
];

// Sample reviewers so events show real ratings out of the box.
const REVIEWERS = [
  { name: 'Aarav Sharma', email: 'aarav@linemate.events' },
  { name: 'Priya Nair', email: 'priya@linemate.events' },
  { name: 'Rahul Verma', email: 'rahul@linemate.events' },
  { name: 'Sara Khan', email: 'sara@linemate.events' },
  { name: 'Ishaan Mehta', email: 'ishaan@linemate.events' },
  { name: 'Ananya Rao', email: 'ananya@linemate.events' },
  { name: 'Kabir Singh', email: 'kabir@linemate.events' },
  { name: 'Meera Iyer', email: 'meera@linemate.events' },
];

// Reviews keyed by index into the `events` array above. Event 0 has many so the
// "show all reviews" behaviour is visible out of the box.
const reviewSeeds: { e: number; r: number; rating: number; comment: string }[] = [
  { e: 0, r: 0, rating: 5, comment: 'The trio was on fire — best jazz night in ages.' },
  { e: 0, r: 1, rating: 4, comment: 'Lovely intimate room. Get there early for a good spot.' },
  { e: 0, r: 2, rating: 5, comment: 'Brushed drums, a stand-up bass, and a horn section that did not quit.' },
  { e: 0, r: 3, rating: 4, comment: 'Great vibe and a fair bar. Will be back next month.' },
  { e: 0, r: 4, rating: 5, comment: 'Felt like a proper old-school jazz club. Goosebumps.' },
  { e: 0, r: 5, rating: 3, comment: 'Music was superb, but it got crowded near the stage.' },
  { e: 0, r: 6, rating: 5, comment: 'Two encores! The sax solo brought the house down.' },
  { e: 0, r: 7, rating: 4, comment: 'Cosy, warm, and the sound was crisp all night.' },
  { e: 2, r: 2, rating: 5, comment: 'The sound system was unreal. Danced till the lights came up.' },
  { e: 2, r: 3, rating: 4, comment: 'Great night — just wish it ran a little longer.' },
  { e: 3, r: 1, rating: 4, comment: 'Genuinely funny sets in the finals. Worth the trip.' },
  { e: 5, r: 0, rating: 5, comment: 'The coastal menu was a highlight of my whole year.' },
  { e: 6, r: 4, rating: 4, comment: 'Bold staging — the in-the-round format really works.' },
  { e: 8, r: 5, rating: 5, comment: 'Beautiful show. The curators were generous with their time.' },
  { e: 10, r: 6, rating: 5, comment: 'Best React lineup yet. The hallway track was gold.' },
  { e: 10, r: 0, rating: 4, comment: 'Strong talks; the lunch queue could be smoother.' },
];

interface SeedOptions {
  /** Wipe events + bookings + reviews before inserting (used by `npm run seed`). */
  reset?: boolean;
  /** Suppress info logging (used during server startup). */
  quiet?: boolean;
}

export async function seedDatabase({ reset = false, quiet = false }: SeedOptions = {}): Promise<void> {
  if (reset) {
    await Promise.all([Event.deleteMany({}), Booking.deleteMany({}), Review.deleteMany({})]);
  }

  let created: Awaited<ReturnType<typeof Event.insertMany>> = [];
  const existingCount = await Event.estimatedDocumentCount();
  if (existingCount === 0) {
    created = await Event.insertMany(
      events.map((e, i) => ({
        ...e,
        imageUrl: EVENT_IMAGES[i] ?? '',
        // Seed some popularity so "trending" and analytics have data.
        bookingCount: e.totalSeats - e.availableSeats,
        viewCount: Math.round((e.totalSeats - e.availableSeats) * 3.5 + 40),
      })),
    );
  } else if (!reset) {
    if (!quiet) logger.info('Events already present — skipping event seed.');
  }

  // Upsert the demo user (idempotent).
  const passwordHash = await bcrypt.hash(DEMO_USER.password, env.BCRYPT_ROUNDS);
  if (!(await User.findOne({ email: DEMO_USER.email }).lean())) {
    await User.create({ name: DEMO_USER.name, email: DEMO_USER.email, passwordHash });
  }

  // Seed sample reviews on a fresh database.
  if (created.length && (await Review.estimatedDocumentCount()) === 0) {
    const reviewers = await Promise.all(
      REVIEWERS.map(async (r) => {
        const found = await User.findOne({ email: r.email });
        return found ?? (await User.create({ name: r.name, email: r.email, passwordHash }));
      }),
    );
    const docs = reviewSeeds
      .filter((s) => created[s.e] && reviewers[s.r])
      .map((s) => ({
        event: created[s.e]!._id,
        user: reviewers[s.r]!._id,
        rating: s.rating,
        comment: s.comment,
      }));
    if (docs.length) await Review.insertMany(docs);

    // Denormalize ratings onto the events.
    const ratings = await Review.aggregate<{ _id: unknown; avg: number; count: number }>([
      { $group: { _id: '$event', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Promise.all(
      ratings.map((g) =>
        Event.updateOne({ _id: g._id }, { ratingAverage: Math.round(g.avg * 10) / 10, ratingCount: g.count }),
      ),
    );
  }

  if (!quiet) {
    logger.info(`Seeded ${events.length} events.`);
    logger.info(`Demo login → ${DEMO_USER.email} / ${DEMO_USER.password}`);
  }
}

// Allow running as a standalone script: `npm run seed`.
if (require.main === module) {
  (async () => {
    if (!env.MONGO_URI) {
      logger.warn(
        'No MONGO_URI set: seeding an in-memory database that will NOT persist. ' +
          'Set MONGO_URI in server/.env to seed a real database.',
      );
    }
    await connectDatabase();
    await seedDatabase({ reset: true });
    await disconnectDatabase();
    logger.info('Done.');
    process.exit(0);
  })().catch((err) => {
    logger.error('Seed failed', err);
    process.exit(1);
  });
}
