import { db } from './client.js';
import bcryptjs from 'bcryptjs';

async function seed() {
  try {
    // Clear existing data
    await db.query(
      'TRUNCATE societies, users, circles, circle_members, interests, requests, request_responses CASCADE'
    );

    const pw = await bcryptjs.hash('demo123', 10);

    // Society
    const { rows: [{ id: societyId }] } = await db.query(
      'INSERT INTO societies (name, invite_code, city) VALUES ($1, $2, $3) RETURNING id',
      ['Riverside Towers', 'RIVER2024', 'Bangalore']
    );

    // Users
    const insertUser = (email: string, first: string, last: string, role: string, approved: boolean, flat: string, trust: number) =>
      db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, society_id, admin_approved, role, trust_score, flat_number)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [email, pw, first, last, societyId, approved, role, trust, flat]
      ).then(r => r.rows[0].id as number);

    const [aliceId, bobId, deepaId, rahulId, meeraId, adminId] = await Promise.all([
      insertUser('alice@example.com',  'Alice',  'Johnson', 'resident', true,  'A-101', 88),
      insertUser('bob@example.com',    'Bob',    'Smith',   'resident', true,  'B-204', 72),
      insertUser('deepa@example.com',  'Deepa',  'Kumar',   'resident', true,  'C-302', 65),
      insertUser('rahul@example.com',  'Rahul',  'Nair',    'resident', true,  'D-405', 79),
      insertUser('meera@example.com',  'Meera',  'Patel',   'resident', true,  'B-108', 91),
      insertUser('admin@example.com',  'Priya',  'Sharma',  'admin',    true,  'A-001', 100),
    ]);

    // Pending user (for admin demo)
    await insertUser('charlie@example.com', 'Charlie', 'Rao', 'resident', false, 'C-305', 0);

    // Interests
    await db.query(
      `INSERT INTO interests (user_id, tag) VALUES
        ($1,'pickleball'),($1,'tennis'),($1,'photography'),
        ($2,'badminton'),($2,'cycling'),($2,'cooking'),
        ($3,'yoga'),($3,'cooking'),($3,'books'),
        ($4,'photography'),($4,'cycling'),($4,'fitness'),
        ($5,'yoga'),($5,'tennis'),($5,'cooking')`,
      [aliceId, bobId, deepaId, rahulId, meeraId]
    );

    // Circles
    const insertCircle = (creatorId: number, name: string, desc: string, category: string, schedule: string) =>
      db.query(
        `INSERT INTO circles (society_id, creator_id, name, description, category, meeting_schedule, approved)
         VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING id`,
        [societyId, creatorId, name, desc, category, schedule]
      ).then(r => r.rows[0].id as number);

    const [pickleballId, yogaId, bookClubId, photoId, cookingId] = await Promise.all([
      insertCircle(aliceId,  'Pickleball Crew',      'Competitive & casual pickleball for all levels.',         'Sports',         'Tue & Thu, 6–8 PM'),
      insertCircle(deepaId,  'Morning Yoga',          'Gentle flow to start your day right.',                   'Fitness',        'Mon, Wed, Fri — 7 AM'),
      insertCircle(deepaId,  'Book Club',             'One book a month, lots of chai and discussion.',         'Books & Learning','Last Sat of month, 5 PM'),
      insertCircle(rahulId,  'Photography Walks',     'Explore Bangalore through a lens every Sunday.',         'Arts & Crafts',  'Sun mornings, 7 AM'),
      insertCircle(bobId,    'Cooking Exchange',      'Share recipes, swap dishes, discover new cuisines.',     'Food & Cooking', 'Last Sun of month, 4 PM'),
    ]);

    // Circle memberships
    await db.query(
      `INSERT INTO circle_members (circle_id, user_id) VALUES
        ($1,$2),($1,$3),($1,$4),($1,$5),
        ($6,$7),($6,$2),($6,$5),
        ($8,$9),($8,$3),
        ($10,$4),($10,$2),
        ($11,$3),($11,$5),($11,$2)`,
      [
        pickleballId, aliceId, bobId, rahulId, meeraId,
        yogaId, deepaId, aliceId, meeraId,
        bookClubId, deepaId, bobId,
        photoId, rahulId, aliceId,
        cookingId, deepaId, meeraId, bobId,
      ]
    );

    const soon  = new Date(Date.now() + 2  * 3600000);  // 2h from now
    const today = new Date(Date.now() + 6  * 3600000);  // 6h from now
    const tmrw  = new Date(Date.now() + 26 * 3600000);  // tomorrow

    // Society-wide standalone requests (no circle_id)
    await db.query(
      `INSERT INTO requests (society_id, creator_id, title, description, needed_by, status, category, urgency) VALUES
        ($1,$2,'Drill machine needed for 2 hours','Have a TV bracket to mount but no drill. Happy to return it right away!',$3,'open','Tool Share','urgent'),
        ($1,$4,'Help with grocery run to DMart','Stuck at home with a bad back — need someone to pick up a small list from DMart.',$5,'open','Errand','high'),
        ($1,$6,'Good plumber recommendation?','Leaky tap in the kitchen. Any reliable plumber who''s worked in this building before?',$7,'open','Maintenance','normal'),
        ($1,$8,'Found keys near B-block lift','Found a set of keys near the B-block lift this morning. DM to claim.',$3,'open','Other','urgent'),
        ($1,$9,'Borrow a ladder — 30 mins','Need to change a ceiling bulb. A 6-foot ladder would do!',$5,'open','Tool Share','high')`,
      [societyId, meeraId, soon, rahulId, today, bobId, tmrw, aliceId, soon, deepaId, today]
    );

    // Circle-scoped requests
    await db.query(
      `INSERT INTO requests (society_id, circle_id, creator_id, title, description, needed_by, status, category, urgency) VALUES
        ($1,$2,$3,'Need a 4th player for tonight','We have 3 confirmed for 6 PM at Court 2. Anyone free to join?',$4,'open','Social & Events','urgent'),
        ($1,$5,$6,'Suggest next month''s book','Open to fiction or non-fiction — what should we read next?',$7,'open','Social & Events','normal'),
        ($1,$8,$9,'Sunday shoot at Cubbon Park','Planning a 2-hour walk around Cubbon Park this Sunday. Joining?',$10,'open','Social & Events','high')`,
      [societyId, pickleballId, aliceId, soon, bookClubId, deepaId, tmrw, photoId, rahulId, today]
    );

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
