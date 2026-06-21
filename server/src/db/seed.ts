import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { logger } from '../lib/logger';
import { Booking } from '../modules/bookings/booking.model';
import { Event, type EventCategory } from '../modules/events/event.model';
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

interface SeedOptions {
  /** Wipe events + bookings before inserting (used by `npm run seed`). */
  reset?: boolean;
  /** Suppress info logging (used during server startup). */
  quiet?: boolean;
}

export async function seedDatabase({ reset = false, quiet = false }: SeedOptions = {}): Promise<void> {
  if (reset) {
    await Promise.all([Event.deleteMany({}), Booking.deleteMany({})]);
  }

  const existingCount = await Event.estimatedDocumentCount();
  if (existingCount === 0) {
    await Event.insertMany(events);
  } else if (!reset) {
    if (!quiet) logger.info('Events already present — skipping event seed.');
  }

  // Upsert the demo user (idempotent).
  const existingUser = await User.findOne({ email: DEMO_USER.email }).lean();
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(DEMO_USER.password, env.BCRYPT_ROUNDS);
    await User.create({ name: DEMO_USER.name, email: DEMO_USER.email, passwordHash });
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
