import { db } from './server/config/database.js';
import { events } from './server/db/schema.js';
import { eq, and, gte, asc, sql } from 'drizzle-orm';
import { EventModel } from './server/models/EventModel.js';

async function main() {
    const all = await db.select().from(events);
    console.log('All events:', all);
    
    const upcoming = await EventModel.getUpcoming(50);
    console.log('Upcoming events:', upcoming);
}

main().catch(console.error);
