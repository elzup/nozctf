// Backfills /userid/{id} for users registered before the index existed.
// Until this runs, the IDs of those users are protected only by the client-side check.
//
//   cd functions
//   gcloud auth application-default login
//   node scripts/backfill-userid.mts --project nozctf           # dry run
//   node scripts/backfill-userid.mts --project nozctf --apply
import { parseArgs } from 'node:util'
import admin from 'firebase-admin'

// gRPC status of `create()` on an existing document
const ALREADY_EXISTS = 6

type LegacyUser = { uid: string; id: string; createdAt: number }

const { values } = parseArgs({
  options: {
    project: { type: 'string' },
    apply: { type: 'boolean', default: false },
  },
})

if (!values.project) {
  throw new Error('--project <projectId> is required')
}

admin.initializeApp({ projectId: values.project })
const db = admin.firestore()

const snap = await db.collection('user').get()
const users: LegacyUser[] = snap.docs
  .map((d) => ({
    uid: d.id,
    id: d.data().id as string,
    createdAt: d.createTime.toMillis(),
  }))
  // The earliest registration keeps an ID that was taken twice
  .toSorted((a, b) => a.createdAt - b.createdAt)

type Outcome = 'created' | 'existing' | 'conflict'

async function backfill(user: LegacyUser): Promise<Outcome> {
  const ref = db.collection('userid').doc(user.id)
  const current = await ref.get()

  if (current.exists) {
    if (current.data()?.uid === user.uid) return 'existing'
    console.warn(
      `conflict: "${user.id}" of ${user.uid} belongs to ${current.data()?.uid}`
    )
    return 'conflict'
  }
  if (!values.apply) return 'created'

  try {
    await ref.create({ uid: user.uid })
    return 'created'
  } catch (e) {
    if ((e as { code?: number }).code !== ALREADY_EXISTS) throw e
    // Registered by the user themself between the read and the write; nothing was lost
    return 'existing'
  }
}

// Sequential on purpose: the order decides who keeps a duplicated ID
const outcomes = await users.reduce<Promise<Outcome[]>>(
  async (done, user) => [...(await done), await backfill(user)],
  Promise.resolve([])
)
const count = (outcome: Outcome) => outcomes.filter((o) => o === outcome).length

console.log(values.apply ? 'applied' : 'dry run (pass --apply to write)', {
  users: users.length,
  created: count('created'),
  existing: count('existing'),
  conflict: count('conflict'),
})
