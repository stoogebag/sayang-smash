# TODO - Sayang Smash

## Bugs

- [ ] Type/Time selector when creating an exercise doesn't clearly indicate which option is selected (needs visual feedback)
- [ ] "Show done" button on Do Workout page is too wide
- [ ] "Close" button on SelectExercise modal is too wide
- [ ] Delete button (X) on exercise list in Create Workout page is too wide
- [ ] Reps count field when adding an exercise accepts empty values

## Features / Enhancements

- [ ] Add default rep number/time to exercise definitions in the schema
  - Need to add optional `defaultReps` and `defaultTime` fields to `SayangSmashExercise` table
  - Update exercise creation form to allow setting defaults
  - Pre-populate parameter forms on Do Workout page with these defaults

- [ ] Workout Saved page: Remove "Copy" button, make the link itself clickable to copy to clipboard instead

- [ ] Do Workout page: Replace "Show"/"Hide" button with a "Show finished" checkbox
