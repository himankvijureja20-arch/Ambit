import { db } from './client.js';
import bcryptjs from 'bcryptjs';

async function seed() {
  try {
    const hashedPassword = await bcryptjs.hash('demo123', 10);

    // Create sample society
    const societyResult = await db.query(
      'INSERT INTO societies (name, invite_code, city) VALUES ($1, $2, $3) RETURNING id',
      ['Riverside Towers', 'RIVER2024', 'Bangalore']
    );
    const societyId = societyResult.rows[0].id;

    // Create sample users
    const user1 = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, society_id, admin_approved, role, trust_score, flat_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      ['alice@example.com', hashedPassword, 'Alice', 'Johnson', societyId, true, 'resident', 85, 'A-101']
    );

    const user2 = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, society_id, admin_approved, role, trust_score, flat_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      ['bob@example.com', hashedPassword, 'Bob', 'Smith', societyId, true, 'resident', 70, 'B-204']
    );

    // Admin user for testing the approval flow
    await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, society_id, admin_approved, role, trust_score, flat_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      ['admin@example.com', hashedPassword, 'Priya', 'Admin', societyId, true, 'admin', 100, 'A-001']
    );

    // A pending resident awaiting admin approval
    await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, society_id, admin_approved, role, flat_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      ['charlie@example.com', hashedPassword, 'Charlie', 'Rao', societyId, false, 'resident', 'C-305']
    );

    const userId1 = user1.rows[0].id;
    const userId2 = user2.rows[0].id;

    // Add interests
    await db.query(
      'INSERT INTO interests (user_id, tag) VALUES ($1, $2), ($1, $3), ($4, $5), ($4, $6)',
      [userId1, 'pickleball', 'tennis', userId2, 'badminton', 'cycling']
    );

    // Create sample circle
    const circleResult = await db.query(
      'INSERT INTO circles (society_id, creator_id, name, description, category, meeting_schedule) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [societyId, userId1, 'Pickleball Group', 'Evening pickleball players', 'Sports', 'Tue/Thu 6 PM']
    );
    const circleId = circleResult.rows[0].id;

    // Add members to circle
    await db.query(
      'INSERT INTO circle_members (circle_id, user_id) VALUES ($1, $2), ($1, $3)',
      [circleId, userId1, userId2]
    );

    // Create sample request
    await db.query(
      `INSERT INTO requests (circle_id, creator_id, title, description, needed_by, status, category, urgency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        circleId,
        userId1,
        'Need a 4th player',
        'Looking for one more player for casual game today',
        new Date(Date.now() + 4 * 3600000),
        'open',
        'Sports',
        'high',
      ]
    );

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
