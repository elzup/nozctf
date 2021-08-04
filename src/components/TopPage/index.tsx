import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Link from 'next/link'
import Router from 'next/router'
import { questions } from '../../questions'
import { Solve, useGlobalSolve, useSolve } from '../../service/firebase'
import App from '../App'
import { useAuth } from '../hooks/useAuth'

function ListWithLogin({ uid }: { uid: string }) {
  const { solve } = useSolve(uid)

  return <List solve={solve} />
}

function List({ solve }: { solve?: Solve }) {
  const { globalSolve } = useGlobalSolve()

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {solve && <TableCell style={{ width: '1rem' }}></TableCell>}
            <TableCell>Q</TableCell>
            <TableCell>Solvers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.num}>
              {solve && (
                <TableCell>
                  {solve[q.num] && <CheckCircleIcon color="secondary" />}
                </TableCell>
              )}
              <TableCell>
                <Link href={`/q/${q.num}`}>
                  <a>
                    {q.num} {q.text}
                  </a>
                </Link>
              </TableCell>
              <TableCell>{globalSolve?.[q.num]?.count || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function TopPage() {
  const { login } = useAuth()

  if (login.status === 'loading') {
    return 'loading...'
  }
  if (login.status === 'auth') {
    Router.push('/register') // NOTE: not login
    return null
  }
  if (login.status === 'comp') {
    return <ListWithLogin uid={login.uid} />
  }
  return <List />
}

function TopPageContainer() {
  return (
    <App>
      <Container fixed maxWidth="md">
        <Paper elevation={0} style={{ marginTop: '1rem' }}>
          <Typography variant="h3">nozctf</Typography>
          <Typography>
            I will give you a question about IT. Look for flags in the
            `FLAG_abcABC123`.
            <br />
            Do not attack this Website.
          </Typography>
        </Paper>
        <TopPage />
      </Container>
    </App>
  )
}

export default TopPageContainer
