import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from 'react';
import './App.css';

import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import Home from './pages/Home';
import Plan from './pages/Plan';
import Rank from './pages/Rank';
import Result from './pages/Result';
import Setup from './pages/Setup';

import UserContext from './contexts/UserContext';
import GameContext from './contexts/GameContext';

function App() {
  const [user, setUser] = useState({ id: undefined, name: undefined });
  const [mapData, setMapData] = useState({ stations: [], segments: [] });
  const [gameResult, setGameResult] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rank" element={<Rank />} />
          <Route
            element={
              <GameContext.Provider value={{ mapData, setMapData, gameResult, setGameResult }}>
                <Outlet />
              </GameContext.Provider>
            }
          >
            <Route path="/game" element={<Plan />} />
            <Route path="/result" element={<Result />} />
            <Route path="/setup" element={<Setup />} />
          </Route>
          <Route path="*" element={<div>404 Error</div>} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
