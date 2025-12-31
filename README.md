# Fantasy Tournament - Frontend

This is a Next.js frontend application for a fantasy tournament game, featuring global leaderboards, per-slate leaderboards, and a personal team management interface.

## Features

### Pages

- **Home (`/`)**: Landing page with links to leaderboard and my team.
- **Global Leaderboard (`/leaderboard`)**: 
  - Shows all teams ranked by total points
  - Auto-refreshes every 30 seconds
  - Manual refresh button
  - Pagination (20 items per page)
  - Highlights "My team"
  - Top 3 teams display medal badges 🥇🥈🥉

- **Slate Leaderboard (`/slate/[slateId]/leaderboard`)**:
  - Shows teams ranked by points for a specific slate
  - Highlights "My lineup" if user played
  - Back button to slate results

- **My Team (`/my-team`)**:
  - Displays all user entries across slates
  - Tabbed interface: All slates | Current | Upcoming
  - Shows total points and slates played
  - Click any slate to view detailed picks

- **My Team Picks (`/my-team/[slateId]/picks`)**:
  - Shows 11 players organized by position (FWD, MID, DEF, GK)
  - Captain badge displayed
  - Points breakdown (if slate is SCORED)
  - Edit button (if slate is OPEN)
  - View-only mode (if LOCKED or SCORED)

- **Slate Results (`/slate/[slateId]/results`)**:
  - Shows fixtures for a slate
  - Link to slate leaderboard

### Components

- `Layout`: Main layout with header navigation and footer
- `LeaderboardTable`: Generic table component for displaying leaderboard data
- `PlayerCard`: Displays player info with optional points breakdown
- `FormationView`: Displays 11 players organized by position
- `FixtureTile`: Shows fixture information

## Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for production

```bash
npm run build
npm start
```

## API Endpoints

The app expects the following API endpoints:

- `GET /api/leaderboard` - Global leaderboard
- `GET /api/slates/:slateId/leaderboard` - Per-slate leaderboard
- `GET /api/my-team` - User's team data
- `GET /api/slates/:slateId/my-picks` - User's picks for a slate
- `GET /api/slates/:slateId` - Slate details

Mock API routes are included in `pages/api/` for development and testing.

## Tech Stack

- **Next.js 14** (Pages Router)
- **React 18**
- **TypeScript**
- **CSS Modules** for component styling
- **Global CSS** for shared styles

## Responsive Design

The app is fully responsive and includes:
- Mobile navigation with hamburger menu
- Table columns hide on mobile for better UX
- Flexible layouts that work on all screen sizes

## Auto-refresh

The global leaderboard auto-refreshes every 30 seconds to show the latest standings.
