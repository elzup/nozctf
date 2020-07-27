import { Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

const Code: React.FC = (props) => {
  const theme = useTheme<Theme>()

  return (
    <pre
      style={{
        overflowX: 'scroll',
        // background: theme.palette.primary.light,
        border: `solid ${theme.palette.primary.light} 2px`,
        padding: '4px',
        borderRadius: '2px',
      }}
    >
      <code>{props.children}</code>
    </pre>
  )
}

export default Code
