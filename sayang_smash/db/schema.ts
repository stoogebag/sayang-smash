import { pgTable, varchar, boolean, timestamp, json, } from 'drizzle-orm/pg-core'

export const exercises = pgTable('sayang_smash_exercises', {
  uid: varchar('uid', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  useWeight: boolean('useWeight'),
  type: varchar('type', { length: 5 }), // REPS or TIME
})

export const entries = pgTable('sayang_smash_entries', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  shareable_link: varchar('shareable_link', { length: 5 }),
  exercises: json('exercises'),
  created_at: timestamp('created_at').defaultNow(),
})
