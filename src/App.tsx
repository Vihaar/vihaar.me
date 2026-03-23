import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import FamilyPage from './pages/FamilyPage'
import SkiingPage from './pages/SkiingPage'
import BoxingPage from './pages/BoxingPage'
import PetitionPage from './pages/PetitionPage'
import MarathonPage from './pages/MarathonPage'
import BatmanMountainPage from './pages/BatmanMountainPage'
import MaxCekotPage from './pages/MaxCekotPage'
import TEDxPage from './pages/TEDxPage'
import ChildActorPage from './pages/ChildActorPage'

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/skiing" element={<SkiingPage />} />
          <Route path="/boxing" element={<BoxingPage />} />
          <Route path="/petition" element={<PetitionPage />} />
          <Route path="/marathon" element={<MarathonPage />} />
          <Route path="/batman-mountain" element={<BatmanMountainPage />} />
          <Route path="/max-cekot" element={<MaxCekotPage />} />
          <Route path="/tedx" element={<TEDxPage />} />
          <Route path="/child-actor" element={<ChildActorPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
