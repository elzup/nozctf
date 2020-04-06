import dynamic from 'next/dynamic'

const RegisterPage = dynamic(() => import('../components/RegisterPage'), {
  ssr: false,
})

export default () => {
  return <RegisterPage />
}
