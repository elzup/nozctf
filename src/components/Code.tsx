import { Theme } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import hljs from 'highlight.js/lib/core'
import csharp from 'highlight.js/lib/languages/csharp'
import javascript from 'highlight.js/lib/languages/javascript'
import shell from 'highlight.js/lib/languages/shell'
import 'highlight.js/styles/mono-blue.css'

// Only the languages the questions use; the full highlight.js build is ~800 KB
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('shell', shell)

type Props = {
  lang?: string
  children: string
}

const Code = ({ children, lang }: Props) => {
  const theme = useTheme<Theme>()
  const style = {
    overflowX: 'scroll',
    border: `solid ${theme.palette.primary.light} 2px`,
    padding: '4px',
    borderRadius: '2px',
  } as const

  // The snippets are string literals in this repository, never user input
  const highlighted =
    lang && hljs.getLanguage(lang)
      ? hljs.highlight(children, { language: lang }).value
      : null

  return (
    <pre style={style}>
      {highlighted === null ? (
        <code className="hljs">{children}</code>
      ) : (
        <code
          className="hljs"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      )}
    </pre>
  )
}

export default Code
