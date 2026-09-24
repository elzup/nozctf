import { Container, Typography } from '@material-ui/core'
import Head from 'next/head'
import Router from 'next/router'
import React, { useEffect } from 'react'
import { solve } from '../service/api'
import { Question } from '../types'
import AnswerForm from './AnswerForm'
import App from './App'
import { useAuth } from './hooks/useAuth'

function AnswerFormContainer({ qid }: { qid: number }) {
  const { login } = useAuth()

  return (
    <AnswerForm
      disabled={login.status !== 'comp'}
      onSubmit={({ flag }) => {
        solve(qid, flag)
          .then((res) => {
            const failMessage = res.data.message ?? 'Invalid'

            alert(res.data.ok ? 'Congratulations!!' : failMessage)
          })
          .catch((e) => {
            console.error('failed to submit flag', e)
            alert('Error: failed to submit')
          })
      }}
    />
  )
}

type Props = {
  q: Question
}
const RedirectQuestionLayout = ({
  q,
  children,
}: React.PropsWithChildren<Props>) => {
  const { login } = useAuth()
  const needsRegister = login.status === 'auth'

  useEffect(() => {
    if (needsRegister) Router.push('/register')
  }, [needsRegister])

  if (login.status === 'loading' || login.status === 'auth') {
    return null
  }
  return (
    <Container>
      <Typography style={{ marginTop: '20px' }} variant="h4">
        {q.num}. {q.text}
      </Typography>
      <section>{children}</section>
      <AnswerFormContainer qid={q.num} />
    </Container>
  )
}

const QuestionLayout = (props: React.PropsWithChildren<Props>) => {
  const title = `nozctf - ${props.q.num}. ${props.q.text}`

  return (
    <App>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
      </Head>
      <RedirectQuestionLayout {...props} />
    </App>
  )
}

export default QuestionLayout
