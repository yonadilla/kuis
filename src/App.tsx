import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LoginForm } from './components/login-form'
import Login from './components/page/login'
import Kuis from './components/page/kuis'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Kuis />
    </>
  )
}

export default App
