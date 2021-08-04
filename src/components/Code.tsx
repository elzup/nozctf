import React from 'react'
import { Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import Highlight from 'react-highlight.js'

type Props = {
  lang?: string
}
const Code: React.FC<Props> = ({ children, lang = '' }) => {
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
      <Highlight language={lang}>{children}</Highlight>
    </pre>
  )
}

export default Code
