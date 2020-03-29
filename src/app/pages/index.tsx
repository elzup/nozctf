import dynamic from 'next/dynamic'
import App from '../components/App'

const TopPage = dynamic(() => import('../components/TopPage'), { ssr: false })

export default () => {
  return <TopPage />
}
