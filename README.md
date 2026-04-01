# TaskFlow

TaskFlow is a task management project built in two versions:

- a React + TypeScript + Vite web app
- a React Native + Expo mobile app

Both apps share the same core product idea: create tasks, organize them by category, track due dates, mark progress, and review simple productivity stats.

## What’s Included

### Web app
- Dashboard with search, filtering, sorting, and bulk delete
- Task creation and editing
- Task details view
- Stats page with completion and category distribution
- Light/dark theme toggle
- Local persistence in browser storage

### Expo app
- Native mobile version of the same task workflow
- Persistent storage with AsyncStorage
- Native date picker for due dates
- Mobile-friendly task form and task management flow
- Light/dark theme support

## Tech Stack

### Web
- React
- TypeScript
- Vite
- React Router

### Mobile
- React Native
- Expo
- TypeScript
- AsyncStorage
- `@react-native-community/datetimepicker`

## Repo Structure

```text
.
├─ src/              # Web application source
├─ public/           # Web static assets
├─ expo-app/         # Expo React Native application
├─ package.json      # Web app scripts and dependencies
└─ README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm
- For mobile testing:
  - Expo Go on Android/iOS, or
  - Android Studio / Xcode simulator setup

## Run The Web App

From the repo root:

```bash
npm install
npm run dev
```

The Vite dev server will start locally and print the URL in the terminal.

### Web scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Run The Expo App

From the `expo-app` folder:

```bash
cd expo-app
npm install
npm start
```

Then choose one of the Expo targets from the terminal:

- `a` for Android
- `i` for iOS
- `w` for web
- or scan the QR code with Expo Go

### Expo scripts

```bash
npm start
npm run android
npm run ios
npm run web
```

## Notes

- The web app and Expo app are intentionally kept side by side so the original web version is preserved.
- Data persistence is local to each platform.
  - Web uses browser local storage.
  - Expo uses AsyncStorage on device.
- The two apps are similar in behavior, but not identical in UI because each one is adapted to its platform.

## Future Improvements

- Shared package for cross-platform business logic
- React Navigation for the Expo app
- Better form validation
- Tests for helpers, filters, and task flows
- Sync with a backend instead of local-only storage

## Contributing

If you want to contribute:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Open a pull request

Clear bug reports, UI improvements, and cleanup refactors are all welcome.

## License

Use it however you want, just remember where you came from (chicken kakadodoling at dinosaur) 🐔🔊🦖
