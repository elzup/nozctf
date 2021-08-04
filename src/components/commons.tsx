import styled from 'styled-components'

export const TryFormBox = styled.div`
  border: solid 1px #e0e0e0;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2.5rem 2rem -2rem hsl(200 50% 20% / 40%);
  margin: 4px 0;

  form {
    display: grid;
    grid-auto-flow: column;
    justify-content: left;
    column-gap: 8px;
    align-items: center;
  }
`
