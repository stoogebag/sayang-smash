# Workout App - Specification Document

**Status**: Source of Truth  
**Last Updated**: 2026-03-23

---

### Communication Guideline

- Always be concise; elaborate only when explicitly requested.
- If more context is needed, ask one focused clarifying question.
- Provide concrete actions or patches when asked, otherwise wait for instruction.

## Overview

**App Name: Sayang Smash**

A simple, open-access workout logging app. No auth, no tracking. Users create workouts, log exercises, and share via link.

---

## Pages & Features

### 1. Landing Page

- **Purpose**: Entry point
- **Components**:
  - Two buttons:
    - "Create Workout" → Navigate to Create Workout page
    - "Do Random Workout" → Pick a random workout from the DB and navigate to its Workout Screen
- **Layout**: Simple, two button layout

---

### 2. Create Workout Page

- **Purpose**: Build a new workout by adding exercises
- **State**:
  - `workout` object containing:
    - `name` (string, default: `"DAYOFWEEK DD/MM/YY"` e.g. "Monday 23/03/26")
    - `exercises` array (each with: exercise reference, reps/time value, weight in kg if applicable)
- **Components**:
  - Workout name (editable, pre-filled with default)
  - Exercise list (displays all exercises added to current workout)
  - "Add Exercise" button → Opens SelectExercise modal
  - "Save" button → Save and navigate to Workout Saved screen
- **Behavior**:
  - User adds exercises one by one via modal
  - Exercises display in list as they're added
  - Same exercise can appear multiple times (e.g. different sets/weights)
  - Once workout is complete, user clicks "Save" button
  - Save action: Upload to Supabase, generate 5-letter unique slug, navigate to Workout Saved screen

---

### 3. SelectExercise Modal

- **Purpose**: Select or create exercises to add to workout
- **Components**:
  - Search/filter input (filters exercise list as user types)
  - Exercise list (all exercises from DB, filtered by search)
  - "Create Exercise" button → Opens inline create exercise form
- **Flow**:
  1. User searches/browses and selects exercise from list
  2. Form appears asking for parameters:
     - If exercise has `useWeight: true`: ask for weight (kg)
     - If exercise `type` is "REPS": ask for number of reps
     - If exercise `type` is "TIME": ask for duration in seconds
  3. User confirms → Exercise added to workout with these parameters
  4. Modal closes, exercise appears in workout list

---

### 4. Create Exercise (Inline Sub-flow)

- **Purpose**: Add new exercise type to DB
- **Location**: Inline within the SelectExercise modal (not a separate page or second modal)
- **Fields**:
  - `name` (string, required)
  - `useWeight` (boolean) — whether weight is applicable
  - `type` (enum: "REPS" or "TIME") — what metric to track
  - `uid` (auto-generated)
- **Behavior**:
  - Form submitted → Exercise saved to DB
  - User returned to SelectExercise exercise list
  - New exercise immediately available in list

---

### 5. Workout Saved Screen

- **Purpose**: Confirmation and sharing screen
- **Displays**:
  - Shareable link to workout
  - QR code of link
  - Share button (native share or copy to clipboard)
  - "Start Workout" button → Navigate to Workout Screen for this workout
- **Generated Data**:
  - 5-letter unique slug for workout URL
- **Behavior**:
  - Workout goes live immediately upon save
  - No review/confirmation step before going live

---

### 6. Workout Screen (Do Workout)

- **Purpose**: Log exercise completion during workout
- **Access**: Via URL slug (e.g., `/workout/abc12`)
- **State**:
  - Workout loaded from DB by slug
  - All exercise progress is LOCAL (browser state only, not persisted to DB)
  - Exercises displayed in list, can be done in any order
- **Display** (for each exercise):
  - Exercise name
  - Current value (reps counted so far, or time remaining)
  - Weight if applicable
  - Visual indicator (greyed out when completed)
- **Controls** (conditional on exercise type):
  - **REPS exercises**:
    - Buttons: `+10`, `+5`, `-1` to adjust rep count
    - Starts at 0, counts UP toward target
    - Auto-completes (greyed out) when target reps reached
  - **TIME exercises**:
    - Play button → Starts countdown timer from target seconds to 0
    - Standard timer controls: pause, resume, stop
    - Auto-completes when timer reaches 0
- **Behavior**:
  - Default: Hide finished exercises
  - Toggle button to show/hide completed exercises
  - "Me Done" button → Navigate to Summary screen

---

### 7. Summary Screen

- **Purpose**: Basic recap of completed workout
- **Display**:
  - List of all exercises with their parameters (name, reps/time, weight)
  - That's it — no stats, no tracking, no graphs

---

## Data Model

### Exercise (stored in DB)

```
{
  uid: string (UUID, auto-generated),
  name: string,
  useWeight: boolean,
  type: "REPS" | "TIME"
}
```

### Workout (stored in DB)

```
{
  id: UUID (primary key),
  name: string (default: "DAYOFWEEK DD/MM/YY"),
  shareable_link: string (5-letter unique slug),
  exercises: JSON array of {
    exercise_uid: string,
    exercise_name: string,
    exercise_type: "REPS" | "TIME",
    reps?: number,
    time?: number (seconds),
    weight?: number (kg, only if exercise.useWeight)
  },
  created_at: timestamp
}
```

**Note**: Exercises are stored as a JSON array column, not a join table. No cross-workout querying needed.

---

## Database Setup (Supabase)

**CRITICAL**: This Supabase project is SHARED with other unrelated applications. All database operations MUST be scoped exclusively to Sayang Smash tables.

- **Project**: Existing Supabase project (shared with other apps)
- **Connection**: Supabase connection strings stored in `.env` file
- **Isolation**:
  - Prefix ALL tables with `sayang_smash_` (non-negotiable)
  - Migrations must only touch `sayang_smash_*` tables
  - Drizzle schemas must not reference tables from other apps
  - Query operations must filter/select exclusively from `sayang_smash_*` namespace
- **Tables**:
  - `sayang_smash_exercises` — exercise definitions
  - `sayang_smash_entries` — saved workouts with exercise data as JSON array

---

## Tech Stack

- **Frontend**: Next.js + React
- **QR Code**: `qrcode.react` (stable, popular, zero dependencies)
- **Styling**: Tailwind CSS
- **Design**: Concept A — Industrial/Utilitarian (Barlow Condensed, Orange #F97316, Green #22C55E, sharp edges, accent bars)
- **Database**: Supabase (prefixed tables, JSON column for exercises, connection via `.env`)
- **API**: tRPC
- **ORM**: Drizzle
- **Deployment**: Vercel

---

## Design Reference

**Layout Preview**: See `layoutPreview/index.html` for Concept A visual reference. Open in a browser to view all 5 screens (Landing, Create Workout, Do Workout, Saved, Summary) at mobile scale with proper styling.

**Design System Files**:

- `apps/nextjs/src/app/_components/concept-a-styles.css` — Core component styles (buttons, cards, forms, etc.)
- `apps/nextjs/tailwind.config.js` — Tailwind customization (colors, fonts, spacing)
- `tooling/tailwind/theme.css` — Global CSS variables and theme tokens

---

## Notes

- No authentication, no user tracking
- Open access — anyone can create/view workouts
- Workouts accessed via shareable 5-letter slug
- No edit after save (initial MVP)
- Workout progress during "Do Workout" is local browser state only
- Time values are in seconds throughout
- **Database isolation**: Do NOT touch or reference any tables outside the `sayang_smash_*` namespace. Drizzle schema must only define `sayang_smash_*` tables.
