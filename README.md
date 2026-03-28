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
- Playback is currently mocked with app state and a timer so the UI and logic are easier to understand first
- Real audio playback has not been connected yet
- Real translation and lyrics APIs have not been connected yet
- Backend work has not started yet

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

### Next planned milestone

- connect real audio playback
- sync the UI with real playback position
- keep lyric highlighting connected to actual playback time

## GitHub Workflow Note

I can keep updating this README as we build so you always understand what changed.

For pushing changes to GitHub from this local repo, the repository first needs a Git remote configured, such as `origin`.
Right now this project does not have a GitHub remote connected yet, so pushes cannot happen from this checkout until that is set up.
