import { useState } from 'react'
import './App.css'
import Main from './Component/Main'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Main></Main>
    </>
  )
}

export default App
