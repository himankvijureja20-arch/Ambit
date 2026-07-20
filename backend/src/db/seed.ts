import { db } from './client.js';
import bcryptjs from 'bcryptjs';

async function seed() {
  try {
    const { rows: [{ count }] } = await db.query('SELECT COUNT(*) FROM societies');
    if (parseInt(count) > 0) {
      console.log('Seed data already exists — skipping.');
      process.exit(0);
    }

    await db.query(
      'TRUNCATE societies, users, circles, circle_members, interests, requests, request_responses CASCADE'
    );

    const pw = await bcryptjs.hash('demo123', 10);

    // Society
    const { rows: [{ id: sid }] } = await db.query(
      'INSERT INTO societies (name, invite_code, city) VALUES ($1, $2, $3) RETURNING id',
      ['Riverside Towers', 'RIVER2024', 'Bangalore']
    );

    // Users
    const u = async (email: string, first: string, last: string, role: string, approved: boolean, flat: string, trust: number) =>
      (await db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, society_id, admin_approved, role, trust_score, flat_number)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [email, pw, first, last, sid, approved, role, trust, flat]
      )).rows[0].id as number;

    const alice  = await u('alice@example.com',   'Alice',   'Johnson', 'resident', true,  'A-101', 88);
    const bob    = await u('bob@example.com',      'Bob',     'Smith',   'resident', true,  'B-204', 72);
    const deepa  = await u('deepa@example.com',   'Deepa',   'Kumar',   'resident', true,  'C-302', 65);
    const rahul  = await u('rahul@example.com',   'Rahul',   'Nair',    'resident', true,  'D-405', 79);
    const meera  = await u('meera@example.com',   'Meera',   'Patel',   'resident', true,  'B-108', 91);
    await         u('admin@example.com',   'Priya',   'Sharma',  'admin',    true,  'A-001', 100);
    await         u('charlie@example.com', 'Charlie', 'Rao',     'resident', false, 'C-305', 0);

    // Interests
    for (const [uid, tags] of [
      [alice,  ['pickleball', 'tennis', 'photography']],
      [bob,    ['badminton', 'cycling', 'cooking']],
      [deepa,  ['yoga', 'cooking', 'books']],
      [rahul,  ['photography', 'cycling', 'fitness']],
      [meera,  ['yoga', 'tennis', 'cooking']],
    ] as [number, string[]][]) {
      for (const tag of tags) {
        await db.query('INSERT INTO interests (user_id, tag) VALUES ($1,$2)', [uid, tag]);
      }
    }

    // Circles  (status column = 'approved')
    const c = async (creatorId: number, name: string, desc: string, category: string, schedule: string) =>
      (await db.query(
        `INSERT INTO circles (society_id, creator_id, name, description, category, meeting_schedule, status)
         VALUES ($1,$2,$3,$4,$5,$6,'approved') RETURNING id`,
        [sid, creatorId, name, desc, category, schedule]
      )).rows[0].id as number;

    const pickleball = await c(alice,  'Pickleball Crew',    'Competitive & casual pickleball for all skill levels.',  'Sports',         'Tue & Thu, 6–8 PM');
    const yoga       = await c(deepa,  'Morning Yoga',       'Gentle flow to start your day right — all welcome.',     'Fitness',        'Mon, Wed, Fri — 7 AM');
    const bookclub   = await c(deepa,  'Book Club',          'One book a month, lots of chai and discussion.',         'Books & Learning','Last Sat of month, 5 PM');
    const photo      = await c(rahul,  'Photography Walks',  'Explore Bangalore through a lens every Sunday.',         'Arts & Crafts',  'Sunday mornings, 7 AM');
    const cooking    = await c(bob,    'Cooking Exchange',   'Share recipes, swap dishes, discover new cuisines.',     'Food & Cooking', 'Last Sunday of month, 4 PM');

    // Memberships
    const join = (circleId: number, userId: number) =>
      db.query('INSERT INTO circle_members (circle_id, user_id) VALUES ($1,$2)', [circleId, userId]);

    await join(pickleball, alice);  await join(pickleball, bob);
    await join(pickleball, rahul);  await join(pickleball, meera);
    await join(yoga, deepa);        await join(yoga, alice);  await join(yoga, meera);
    await join(bookclub, deepa);    await join(bookclub, bob);
    await join(photo, rahul);       await join(photo, alice);
    await join(cooking, bob);       await join(cooking, deepa); await join(cooking, meera);

    const now   = new Date();
    const soon  = new Date(now.getTime() + 2  * 3600000);
    const today = new Date(now.getTime() + 6  * 3600000);
    const tmrw  = new Date(now.getTime() + 26 * 3600000);

    // Society-wide standalone requests (circle_id = null)
    const sr = (creatorId: number, title: string, desc: string, neededBy: Date, cat: string, urgency: string) =>
      db.query(
        `INSERT INTO requests (society_id, creator_id, title, description, needed_by, status, category, urgency)
         VALUES ($1,$2,$3,$4,$5,'open',$6,$7)`,
        [sid, creatorId, title, desc, neededBy, cat, urgency]
      );

    await sr(meera,  'Drill machine needed for 2 hours',   'Have a TV bracket to mount but no drill. Happy to return it straight away!',     soon,  'Tool Share',   'urgent');
    await sr(rahul,  'Help with grocery run to DMart',      'Stuck at home — need someone to pick up a small list from DMart, will transfer money.', today, 'Errand',  'high');
    await sr(bob,    'Good plumber recommendation?',        'Leaky tap in the kitchen. Any reliable plumber who\'s worked in this building?', tmrw,  'Maintenance',  'normal');
    await sr(alice,  'Found keys near B-block lift',        'Found a set of keys near the B-block lift this morning. DM me to describe & claim.',  soon,  'Other',   'urgent');
    await sr(deepa,  'Borrow a ladder for 30 mins',         'Need to change a ceiling bulb. A 6-foot ladder would do!',                      today, 'Tool Share',   'high');

    // Circle-scoped requests
    const cr = (circleId: number, creatorId: number, title: string, desc: string, neededBy: Date, cat: string, urgency: string) =>
      db.query(
        `INSERT INTO requests (society_id, circle_id, creator_id, title, description, needed_by, status, category, urgency)
         VALUES ($1,$2,$3,$4,$5,$6,'open',$7,$8)`,
        [sid, circleId, creatorId, title, desc, neededBy, cat, urgency]
      );

    await cr(pickleball, alice, 'Need a 4th player for tonight',      'We have 3 confirmed for 6 PM at Court 2. Anyone free to join us?',          soon,  'Social & Events', 'urgent');
    await cr(bookclub,   deepa, 'Suggest next month\'s book',         'Open to fiction or non-fiction — what should we read next? Drop suggestions!', tmrw, 'Social & Events', 'normal');
    await cr(photo,      rahul, 'Sunday shoot at Cubbon Park?',       'Planning a 2-hour walk around Cubbon Park this Sunday. Who\'s joining?',       today, 'Social & Events', 'high');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
