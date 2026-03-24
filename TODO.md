# TODO - Sayang Smash

## Features / Enhancements

- [ ] Add default rep number/time to exercise definitions in the schema
  - Need to add optional `defaultReps` and `defaultTime` fields to `SayangSmashExercise` table
  - Update exercise creation form to allow setting defaults
  - Pre-populate parameter forms on Do Workout page with these defaults

- [ ] Workout Saved page: Remove "Copy" button, make the link itself clickable to copy to clipboard instead

- [ ] Do Workout page: Replace "Show"/"Hide" button with a "Show finished" checkbox

- [ ] List Workouts page: Show last 5 created workouts as buttons, allow starting one by clicking
  - Add `workouts.listRecent` tRPC procedure to get last 5 workouts
  - Create `/workouts` page with list of recent workouts
  - Link from landing page (new button or section)
