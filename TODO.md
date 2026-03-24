# TODO - Sayang Smash

## Bugs

- [x] Type/Time selector when creating an exercise doesn't clearly indicate which option is selected (needs visual feedback) - **FIXED: Already had orange highlight**
- [x] "Show done" button on Do Workout page is too wide - **FIXED: Changed text to "Show"/"Hide" and reduced font size**
- [x] "Close" button on SelectExercise modal is too wide - **FIXED: Reduced font size**
- [x] Delete button (X) on exercise list in Create Workout page is too wide - **FIXED: Added flex-shrink-0**
- [x] Reps count field when adding an exercise accepts empty values - **FIXED: Added validation to require value**

## Features / Enhancements

- [ ] Add default rep number/time to exercise definitions in the schema
  - Need to add optional `defaultReps` and `defaultTime` fields to `SayangSmashExercise` table
  - Update exercise creation form to allow setting defaults
  - Pre-populate parameter forms on Do Workout page with these defaults
