import {
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { createTestEnv } from './helpers'

let env: RulesTestEnvironment

const asUser = (uid: string) => env.authenticatedContext(uid).firestore()
const asGuest = () => env.unauthenticatedContext().firestore()

function register(uid: string, id: unknown, userData?: object) {
  const db = asUser(uid)
  const batch = db.batch()

  batch.set(db.doc(`user/${uid}`), userData ?? { id })
  batch.set(db.doc(`userid/${id}`), { uid })
  return batch.commit()
}

beforeAll(async () => {
  env = await createTestEnv()
})
beforeEach(() => env.clearFirestore())
afterAll(() => env.cleanup())

describe('user registration', () => {
  it('accepts user + userid written together', async () => {
    await assertSucceeds(register('alice', 'alice01'))
  })

  it('rejects a user doc without the userid index', async () => {
    await assertFails(asUser('alice').doc('user/alice').set({ id: 'alice01' }))
  })

  it('rejects a userid index without the user doc', async () => {
    await assertFails(
      asUser('alice').doc('userid/alice01').set({ uid: 'alice' })
    )
  })

  it('rejects an ID that is already taken', async () => {
    await assertSucceeds(register('alice', 'same'))
    await assertFails(register('bob', 'same'))
  })

  it('rejects registering a second ID', async () => {
    await assertSucceeds(register('alice', 'first'))
    await assertFails(register('alice', 'second'))
    await assertFails(
      asUser('alice').doc('userid/second').set({ uid: 'alice' })
    )
  })

  it('rejects writing for someone else', async () => {
    const db = asUser('mallory')
    const batch = db.batch()

    batch.set(db.doc('user/alice'), { id: 'alice01' })
    batch.set(db.doc('userid/alice01'), { uid: 'alice' })
    await assertFails(batch.commit())
  })

  it('rejects an index that points at someone else', async () => {
    const db = asUser('mallory')
    const batch = db.batch()

    batch.set(db.doc('user/mallory'), { id: 'mal' })
    batch.set(db.doc('userid/mal'), { uid: 'alice' })
    await assertFails(batch.commit())
  })

  it.each([['UPPER'], ['with space'], ['a'.repeat(21)], ['日本語']])(
    'rejects invalid ID %j',
    async (id) => {
      await assertFails(register('alice', id))
    }
  )

  it('rejects a non-string ID', async () => {
    await assertFails(asUser('alice').doc('user/alice').set({ id: 12345 }))
  })

  it('rejects extra fields', async () => {
    await assertFails(
      register('alice', 'alice01', { id: 'alice01', admin: true })
    )
  })

  it('rejects guests', async () => {
    await assertFails(asGuest().doc('user/alice').set({ id: 'alice01' }))
  })

  it('lets a user from before /userid existed claim their own index', async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      ctx.firestore().doc('user/old').set({ id: 'oldid' })
    )
    await assertFails(
      asUser('mallory').doc('userid/oldid').set({ uid: 'mallory' })
    )
    await assertSucceeds(asUser('old').doc('userid/oldid').set({ uid: 'old' }))
  })
})

describe('registered data is immutable', () => {
  beforeEach(() => register('alice', 'alice01'))

  it('rejects update and delete of user', async () => {
    await assertFails(asUser('alice').doc('user/alice').set({ id: 'renamed' }))
    await assertFails(asUser('alice').doc('user/alice').delete())
  })

  it('rejects update and delete of userid', async () => {
    await assertFails(
      asUser('alice').doc('userid/alice01').set({ uid: 'alice' })
    )
    await assertFails(asUser('alice').doc('userid/alice01').delete())
  })
})

describe('reads', () => {
  beforeEach(() => register('alice', 'alice01'))

  it('lets signed-in users get a user and a userid', async () => {
    await assertSucceeds(asUser('bob').doc('user/alice').get())
    await assertSucceeds(asUser('bob').doc('userid/alice01').get())
  })

  it('allows the ID availability query only with limit(1)', async () => {
    const users = asUser('bob').collection('user')

    await assertSucceeds(users.where('id', '==', 'alice01').limit(1).get())
    await assertFails(users.where('id', '==', 'alice01').get())
    await assertFails(users.get())
    await assertFails(users.limit(100).get())
  })

  it('never lists the userid index', async () => {
    await assertFails(asUser('bob').collection('userid').get())
    await assertFails(asUser('bob').collection('userid').limit(1).get())
  })

  it('rejects guests', async () => {
    await assertFails(asGuest().doc('user/alice').get())
    await assertFails(asGuest().doc('userid/alice01').get())
    await assertFails(asGuest().collection('solve').get())
  })
})

describe('server-only collections', () => {
  it('solve is read-only for clients', async () => {
    await assertSucceeds(asUser('alice').collection('solve').get())
    await assertFails(asUser('alice').doc('solve/alice').set({ 1: new Date() }))
    await assertFails(asUser('alice').doc('solve/alice').delete())
  })

  it.each(['ans/1', 'ratelimit/answer_alice', 'anything/else'])(
    '%s is closed to clients',
    async (path) => {
      await assertFails(asUser('alice').doc(path).get())
      await assertFails(asUser('alice').doc(path).set({ flagHash: 'x' }))
    }
  )
})
