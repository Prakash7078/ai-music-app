# AI Music App

A Spotify-inspired mobile music streaming app built with React Native and Expo.

This project is being developed step by step for learning and understanding the full product flow:
- frontend screens and reusable components
- app-wide state management
- audio playback and synced lyrics
- multilingual lyric translation
- backend APIs, controllers, models, and middleware

## Vision

The app is planned to include:
- email and Google authentication
- a home screen with songs and recommendations
- a full player screen with play, pause, next, previous, and seek controls
- time-synced lyrics
- language selection for multilingual users
- real-time lyric translation using an API
- synced translated lyrics during playback
- a modern music app UI inspired by Spotify

## Tech Stack

### Frontend
- React Native with Expo
- Expo Router for navigation
- TypeScript

### Planned audio and AI integrations
- Expo audio playback
- lyrics provider API
- translation API such as OpenAI or Google Translate

### Planned backend
- Node.js
- Express
- SQL or MongoDB

## Backend Setup

The project now includes a basic Express backend in the `server/` folder with:
- routes
- controllers
- models
- middleware
- services

Start the backend with:

```bash
npm run server
```

Copy the example env file before starting real API integration:

```bash
cp .env.example .env
```

## Current Progress

The project setup is complete, and the first frontend foundation milestone is implemented.

### Completed in this milestone
- Replaced the Expo starter screens with a music app foundation
- Added a clean Home screen
- Added a Player screen
- Created centralized shared app state
- Added mock song data
- Added multilingual mock lyrics
- Added lyric highlighting based on playback progress
- Added reusable UI components for song cards, player controls, progress display, and language selection

### Current limitation
- Audio playback now uses bundled local demo audio through Expo audio
- Songs can load from the backend API when configured, otherwise they fall back to local demo data
- Lyrics now pass through a service layer with API-ready fetch and translation functions
- If no backend URL is configured, the app falls back to local demo lyric data
- Real third-party lyrics and translation providers are not connected yet
- Backend is scaffolded, but authentication and database integration have not started yet

## Project Structure

```text
src/
  app/
    _layout.tsx
    index.tsx
    player/[songId].tsx
  components/
    language-selector.tsx
    lyric-line.tsx
    player-controls.tsx
    progress-slider.tsx
    screen-container.tsx
    section-header.tsx
    song-card.tsx
  constants/
    theme.ts
  context/
    app-state.tsx
  data/
    mock-songs.ts
  types/
    music.ts
  utils/
    time.ts
server/
  controllers/
  data/
  middleware/
  models/
  routes/
  app.js
  server.js
```

## What Each Main File Does

- `src/app/index.tsx`: home screen with active song overview and list of songs
- `src/app/player/[songId].tsx`: player screen with controls, progress, and synced lyrics
- `src/context/app-state.tsx`: central app state for active song, playback state, progress, and selected language
- `src/data/mock-songs.ts`: demo songs and multilingual lyric data
- `src/components/*`: reusable UI pieces for the app
- `src/constants/theme.ts`: colors, spacing, radius, and typography tokens

## How To Run

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Run for Android:

```bash
npm run android
```

Run for web:

```bash
npm run web
```

### Optional API connection

When you start building the backend, set this environment variable so the frontend service layer can call it:

```bash
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:3000
```

Without this value, the app uses local fallback lyric and translation data so development can continue.

For Android emulator testing, `10.0.2.2` usually points back to your computer:

```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000
```

To use Audius-backed discovery in the backend, add:

```bash
AUDIUS_API_BEARER_TOKEN=your_audius_bearer_token
```

Without this token, the backend falls back to local demo songs.

## Development Log

### Milestone 1: App foundation

Implemented:
- stack navigation between Home and Player
- reusable music UI components
- centralized playback and language state
- multilingual lyric demo data
- synced lyric highlighting with mocked playback progress

Why this was done:
- to replace the starter template with a structure that is closer to a real product
- to make the next steps easier to understand and build incrementally
- to keep the learning process clear before adding real APIs and backend code

### Milestone 2: Real audio playback

Implemented:
- installed `expo-audio`
- replaced mocked playback progress with real playback status
- connected the shared app state to a real audio player
- made play, pause, next, previous, and seek work through the actual player
- updated the player screen so lyrics follow live playback time

Why this was done:
- to move from UI-only simulation into real music app behavior
- to make lyric syncing depend on actual playback time instead of a timer
- to prepare the app for real lyrics and translation APIs in the next step

### Milestone 3: Lyrics and translation service layer

Implemented:
- added a lyrics fetch service
- added a lyrics translation service
- moved the player state to use fetched lyrics instead of reading directly from song objects
- added loading, ready, and error states for lyrics and translation
- made the app fallback to local multilingual lyrics when a backend URL is not configured

Why this was done:
- to prepare the frontend for a real backend without blocking learning progress
- to separate UI code from lyrics and translation logic
- to make the next backend/API milestone much easier to plug in
- to keep the player usable even before external APIs are connected

## Audio Troubleshooting

If you do not hear sound right away:
- wait for the player screen to show that audio is ready
- press the `Play` button once after the stream finishes loading
- increase the device or emulator media volume
- use the latest app reload because the demo tracks are now bundled locally inside the project

### Milestone 4: Backend song API

Implemented:
- added an Express backend under `server/`
- created routes, controllers, models, and middleware
- added `/api/health`, `/api/songs`, `/api/lyrics`, and `/api/translate-lyrics`
- connected the frontend song list to a songs service
- kept frontend fallback behavior when the backend URL is not configured

Why this was done:
- to move song data loading toward a real full-stack structure
- to match the preferred backend learning flow of routes, controllers, models, and middleware
- to prepare the app for auth, database models, and protected APIs next

### Milestone 5: Audius discovery integration

Implemented:
- added an Audius service in the backend
- added `/api/discover/trending` for trending songs
- added `/api/search?q=...` for track search
- added `/api/discover/users` for frontend user discovery
- added `/api/users/search?q=...` for user search
- switched the frontend songs fetch to use the new trending endpoint
- kept local fallback behavior when the Audius bearer token is not configured

Why this was done:
- to start pulling songs from a real music catalog API
- to keep the backend architecture clean by isolating third-party API logic in a service
- to let the frontend grow toward real discovery and search without breaking the learning flow

### Milestone 6: Audius stream playback wiring

Implemented:
- added backend `.env` loading with `dotenv`
- added `.env.example`
- added `/api/tracks/:trackId/stream` to resolve and redirect Audius stream URLs
- updated frontend song hydration so Audius songs can use backend-provided stream playback
- fixed the empty-song response case so the UI falls back cleanly instead of staying in loading state
- added a frontend artist/user section so Audius user data is visible on the home screen

Why this was done:
- to let Audius songs become playable in the frontend player
- to make local setup clearer for both Expo and backend env values
- to improve debugging when the backend returns no songs

### Next planned milestone

- add authentication routes and middleware
- create user and session models
- connect the frontend to login/signup flow

## GitHub Workflow Note

I can keep updating this README as we build so you always understand what changed.

The repo is connected to GitHub, and each milestone can be committed, documented in this README, and pushed as we go.
