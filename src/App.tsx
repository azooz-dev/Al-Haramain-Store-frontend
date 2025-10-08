import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ReduxProvider from './store/ReduxProvider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ReduxProvider>
    <>
    </>
    </ReduxProvider>
  )
}

export default App
