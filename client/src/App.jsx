import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuctionRoom from "./pages/Auctionroom";
import Players from "./pages/Players";
import Team from "./pages/Team";
import Results from "./pages/Results";
import Analytics from "./pages/Analytics";
import SetupAuction from "./pages/SetupAuction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<SetupAuction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/players" element={<Players />} />
        <Route path="/teams" element={<Team />} />
        <Route path="/auction/:id" element={<AuctionRoom />} />
        <Route path="/results" element={<Results />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;