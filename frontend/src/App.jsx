import Home from './pages/Home.jsx'
import FluidCanvas from './components/FluidCanvas/FluidCanvas.jsx'
import LiquidCursor from './components/LiquidCursor/LiquidCursor.jsx'
import useLenis from './hooks/useLenis.js'

function App() {
  useLenis()
  return (
    <>
      <FluidCanvas />
      <Home />
      <LiquidCursor />
    </>
  )
}

export default App
