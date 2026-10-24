# nozctf

OSS web ctf app

https://nozctf.web.app

## Setup

```sh
pnpm install
(cd functions && npm install)   # functions stay on npm: the Cloud Functions build installs from package-lock.json
```

### Web (`/`)

Put the Firebase web config in `.env` (read by `next.config.js`).

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

```sh
pnpm dev
```

## Check

| command          | what                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| `pnpm lint`      | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                |
| `pnpm format`    | [oxfmt](https://oxc.rs/docs/guide/usage/formatter) (`pnpm format:fix` to write) |
| `pnpm typecheck` | tsc (TypeScript 7) for the web app and functions                                |
| `pnpm test`      | unit tests (vitest): `src/**/*.test.ts`, `functions/src/**/*.test.ts`           |
| `pnpm verify`    | all of the above                                                                |
| `pnpm test:e2e`  | `e2e/` against the Firebase emulators (needs JDK 21+)                           |

`pnpm test:e2e` starts the auth / functions / firestore emulators as the project `demo-nozctf`,
so it never touches the real project. It covers `firestore.rules` and the callable functions
with the test-only flags in `functions/.env.demo-nozctf`.

To use the app itself against the emulators, run `pnpm emulators` and `pnpm dev:emulator` in two terminals.

This repository is public: keep the intended solutions of the questions out of the tests.

### Functions (`/functions`)

Flags are [parameterized configuration](https://firebase.google.com/docs/functions/config-env).
Copy `functions/.env.example` to `functions/.env` and fill in the values. `.env` files are git-ignored.

## Deploy

```sh
pnpm deploy                               # hosting (runs `next build` -> out/)
(cd functions && npm run deploy)          # functions
firebase deploy --only firestore:rules    # rules
```

Users registered before `/userid` existed have no index doc. Backfill it once after deploying the rules:

```sh
cd functions
node scripts/backfill-userid.mts --project nozctf           # dry run
node scripts/backfill-userid.mts --project nozctf --apply
```

`stats/solvers` (solver count per question) is maintained by the `answer` function. Build it once
from the existing `solve` documents after deploying functions; re-running is safe:

```sh
cd functions
node scripts/backfill-stats.mts --project nozctf           # dry run
node scripts/backfill-stats.mts --project nozctf --apply
```

`/tryq7` (Q7, C#) is served by a function that is not part of this repository.

## Firestore

| collection  | written by | note                                                   |
| ----------- | ---------- | ------------------------------------------------------ |
| `user`      | client     | `{ id }`, create only, together with `userid`          |
| `userid`    | client     | `{ uid }` per user ID, makes the ID unique             |
| `solve`     | functions  | `{ [questionNum]: solvedAt }` per uid, owner-only read |
| `stats`     | functions  | `solvers`: `{ [questionNum]: count }`, public read     |
| `ans`       | admin      | `{ flagHash }` (md5 of the flag) per question          |
| `ratelimit` | functions  | request timestamps per `{scope}_{uid}` (min + day cap) |
