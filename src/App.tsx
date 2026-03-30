import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ChainNewPage, { ChainEditPage } from './pages/ChainNew'
import ChainView from './pages/ChainView'
import NoteNew from './pages/NoteNew'
import Stats from './pages/Stats'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <div
        className="mx-auto min-h-screen relative"
        style={{ maxWidth: 480, background: '#09090B' }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chain/new" element={<ChainNewPage />} />
          <Route path="/chain/:id" element={<ChainView />} />
          <Route path="/chain/:id/edit" element={<ChainEditPage />} />
          <Route path="/note/new" element={<NoteNew />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
