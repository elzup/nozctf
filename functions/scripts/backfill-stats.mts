// Rebuilds stats/solvers (solver count per question) from every solve document.
// Run once after deploying the answer function that maintains it; safe to re-run.
//
//   cd functions
//   gcloud auth application-default login
//   node scripts/backfill-stats.mts --project nozctf           # dry run
//   node scripts/backfill-stats.mts --project nozctf --apply
import { parseArgs } from 'node:util'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const { values } = parseArgs({
  options: {
    project: { type: 'string' },
    apply: { type: 'boolean', default: false },
  },
})

if (!values.project) {
  throw new Error('--project <projectId> is required')
}

initializeApp({ projectId: values.project })
const db = getFirestore()

const snap = await db.collection('solve').get()
const counts = snap.docs
  .flatMap((d) => Object.keys(d.data()))
  .reduce<Record<string, number>>(
    (acc, q) => ({ ...acc, [q]: (acc[q] ?? 0) + 1 }),
    {}
  )

if (values.apply) {
  // Overwrite, not merge: a question with no solvers must not keep a stale count
  await db.collection('stats').doc('solvers').set(counts)
}

console.log(values.apply ? 'applied' : 'dry run (pass --apply to write)', {
  solvers: snap.size,
  counts,
})
