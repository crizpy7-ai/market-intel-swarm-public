import { Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'
import { SwarmRunProvider } from '@/lib/swarm-api'
import Home from '@/pages/Home'
import Playbook from '@/pages/Playbook'
import History from '@/pages/History'
import TrackRecord from '@/pages/TrackRecord'
import Methodology from '@/pages/Methodology'

export default function App() {
  return (
    <SwarmRunProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="playbook" element={<Playbook />} />
          <Route path="history" element={<History />} />
          <Route path="track-record" element={<TrackRecord />} />
          <Route path="methodology" element={<Methodology />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </SwarmRunProvider>
  )
}
