# nozctf

OSS web ctf app

https://nozctf.web.app

## Setup

```sh
yarn install
(cd functions && npm install)
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
yarn dev
```

## Check

| command          | what                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `yarn lint`      | [oxlint](https://oxc.rs/docs/guide/usage/linter)                      |
| `yarn format`    | prettier (`yarn format:fix` to write)                                 |
| `yarn typecheck` | tsc for the web app and functions                                     |
| `yarn test`      | unit tests (vitest): `src/**/*.test.ts`, `functions/src/**/*.test.ts` |
| `yarn verify`    | all of the above                                                      |
| `yarn test:e2e`  | `e2e/` against the Firebase emulators (needs Java)                    |

`yarn test:e2e` starts the auth / functions / firestore emulators as the project `demo-nozctf`,
so it never touches the real project. It covers `firestore.rules` and the callable functions
with the test-only flags in `functions/.env.demo-nozctf`.

To use the app itself against the emulators, run `yarn emulators` and `yarn dev:emulator` in two terminals.

This repository is public: keep the intended solutions of the questions out of the tests.

### Functions (`/functions`)

Flags are [parameterized configuration](https://firebase.google.com/docs/functions/config-env).
Copy `functions/.env.example` to `functions/.env` and fill in the values. `.env` files are git-ignored.

## Deploy

```sh
yarn deploy                               # hosting (runs `next build` -> out/)
(cd functions && npm run deploy)          # functions
firebase deploy --only firestore:rules    # rules
```

Users registered before `/userid` existed have no index doc. Backfill it once after deploying the rules:

```sh
cd functions
node scripts/backfill-userid.mts --project nozctf           # dry run
node scripts/backfill-userid.mts --project nozctf --apply
```

`/tryq7` (Q7, C#) is served by a function that is not part of this repository.

## Firestore

| collection  | written by | note                                          |
| ----------- | ---------- | --------------------------------------------- |
| `user`      | client     | `{ id }`, create only, together with `userid` |
| `userid`    | client     | `{ uid }` per user ID, makes the ID unique    |
| `solve`     | functions  | `{ [questionNum]: solvedAt }` per uid         |
| `ans`       | admin      | `{ flagHash }` (md5 of the flag) per question |
| `ratelimit` | functions  | request timestamps per `{scope}_{uid}`        |
