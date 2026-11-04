import Home from './pages/Home.jsx'
import LegalPage from './components/Legal/LegalPage.jsx'
import { LEGAL_PAGES } from './components/Legal/legalContent.jsx'
import FluidCanvas from './components/FluidCanvas/FluidCanvas.jsx'
import LiquidCursor from './components/LiquidCursor/LiquidCursor.jsx'
import useLenis from './hooks/useLenis.js'
import { usePath } from './lib/router.js'

function App() {
  useLenis()
  const path = usePath()
  const legalPage = LEGAL_PAGES[path.replace(/\/$/, '')]

  return (
    <>
      <FluidCanvas />
      {legalPage ? <LegalPage key={path} page={legalPage} /> : <Home />}
      <LiquidCursor />
    </>
  )
}

export default App
