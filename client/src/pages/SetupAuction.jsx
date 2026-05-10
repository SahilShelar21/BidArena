import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from 'xlsx';
import {
  Trophy,
  Users,
  UserPlus,
  Rocket,
  Image as ImageIcon,
  Calendar,
  Layers,
  IndianRupee,
  Hash,
  ShieldCheck,
  Upload,
  FileSpreadsheet,
} from "lucide-react";

export default function SetupAuction() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tournament");
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  const [tournamentForm, setTournamentForm] = useState({
    name: "", sport: "Cricket", logo: null, auction_date: "", max_teams: "", purse: "", min_increment: "",
  });

  const [teamForm, setTeamForm] = useState({
    name: "", owner_name: "", logo: null, purse: "", city: "",
  });

  const [playerForm, setPlayerForm] = useState({
    name: "", photo: null, age: "", role: "", category: "", base_price: "", country: "",
  });

  const [excelFile, setExcelFile] = useState(null);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Logic remains identical to your original code
  const handleTournamentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(tournamentForm).forEach(([key, value]) => formData.append(key, value));
    try {
      await api.post("/tournaments", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Tournament Created Successfully!");
      setTournamentForm({ name: "", sport: "Cricket", logo: null, auction_date: "", max_teams: "", purse: "", min_increment: "" });
      fetchTournaments();
      setActiveTab("team"); // Redirect to team tab
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return alert("Please select a tournament first");
    const formData = new FormData();
    formData.append("tournament_id", selectedTournament);
    Object.entries(teamForm).forEach(([key, value]) => formData.append(key, value));
    try {
      await api.post("/teams", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Team Registered Successfully!");
      setTeamForm({ name: "", owner_name: "", logo: null, purse: "", city: "" });
      setActiveTab("player"); // Redirect to player tab
    } catch (err) { alert("Error: " + err.message); }
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTournament) return alert("Please select a tournament first");
    const formData = new FormData();
    formData.append("tournament_id", selectedTournament);
    Object.entries(playerForm).forEach(([key, value]) => formData.append(key, value));
    try {
      await api.post("/players", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Player Added Successfully!");
      setPlayerForm({ name: "", photo: null, age: "", role: "", category: "", base_price: "", country: "" });
      setActiveTab("start"); // Redirect to start tab
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleStartAuction = () => {
    if (!selectedTournament) return alert("Select Tournament");
    navigate(`/dashboard?tournament=${selectedTournament}`);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!selectedTournament) {
      alert("Please select a tournament first");
      return;
    }

    setExcelFile(file);
    setIsUploadingExcel(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process each row and send to API
      for (const row of jsonData) {
        const playerData = {
          tournament_id: selectedTournament,
          name: row.name || row.Name || row.player_name || row.Player_Name,
          age: row.age || row.Age,
          role: row.role || row.Role || row.position || row.Position,
          category: row.category || row.Category || row.tier || row.Tier,
          base_price: row.base_price || row.Base_Price || row.price || row.Price,
          country: row.country || row.Country,
          // Note: Excel upload won't include photos, users can add them individually later
        };

        // Validate required fields
        if (!playerData.name || !playerData.age || !playerData.role || !playerData.category || !playerData.base_price || !playerData.country) {
          console.warn("Skipping row due to missing required fields:", row);
          continue;
        }

        try {
          await api.post("/players", playerData);
        } catch (err) {
          console.error("Error uploading player:", playerData.name, err.message);
        }
      }

      alert("Excel upload completed! Players have been added to the tournament.");
      setExcelFile(null);
      e.target.value = null; // Reset file input
      setActiveTab("start"); // Redirect to start tab after bulk upload

    } catch (err) {
      alert("Error processing Excel file: " + err.message);
    } finally {
      setIsUploadingExcel(false);
    }
  };

  // UI Components
  const TabButton = ({ id, label, icon: Icon, color }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 font-semibold overflow-hidden ${
          isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className={`absolute inset-0 bg-gradient-to-r ${color} -z-10`}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Icon size={20} />
        {label}
      </button>
    );
  };

  const inputStyles = "w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500 text-white";

  return (
    <div className="min-h-screen bg-[#0a0f1e] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0f1e] to-[#0a0f1e] text-white p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto text-center mb-16 mt-8">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            BIDARENA
          </h1>
          <p className="text-slate-400 text-lg font-medium">Tournament Management Console</p>
        </motion.div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto mb-12 flex flex-wrap justify-center gap-2 p-2 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/5">
        <TabButton id="tournament" label="Tournament" icon={Trophy} color="from-blue-600 to-blue-400" />
        <TabButton id="team" label="Team" icon={Users} color="from-emerald-600 to-emerald-400" />
        <TabButton id="player" label="Player" icon={UserPlus} color="from-purple-600 to-purple-400" />
        <TabButton id="start" label="Launch" icon={Rocket} color="from-rose-600 to-rose-400" />
      </div>

      {/* Form Container */}
      <motion.div
        key={activeTab}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* TOURNAMENT TAB */}
          {activeTab === "tournament" && (
            <form onSubmit={handleTournamentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-400 ml-1">General Info</label>
                   <input className={inputStyles} placeholder="Tournament Name" value={tournamentForm.name} onChange={(e) => setTournamentForm({ ...tournamentForm, name: e.target.value })} required />
                   <select className={inputStyles} value={tournamentForm.sport} onChange={(e) => setTournamentForm({ ...tournamentForm, sport: e.target.value })}>
                    <option>Cricket</option>
                    <option>Football</option>
                    <option>Kabaddi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Auction Timing</label>
                  <input type="datetime-local" className={inputStyles} value={tournamentForm.auction_date} onChange={(e) => setTournamentForm({ ...tournamentForm, auction_date: e.target.value })} required />
                  <input type="file" className={`${inputStyles} file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700`} accept="image/*" onChange={(e) => setTournamentForm({ ...tournamentForm, logo: e.target.files[0] })} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" className={inputStyles} placeholder="Max Teams" value={tournamentForm.max_teams} onChange={(e) => setTournamentForm({ ...tournamentForm, max_teams: e.target.value })} required />
                <input type="number" className={inputStyles} placeholder="Purse (Cr)" value={tournamentForm.purse} onChange={(e) => setTournamentForm({ ...tournamentForm, purse: e.target.value })} required />
                <input type="number" className={inputStyles} placeholder="Min Incr." value={tournamentForm.min_increment} onChange={(e) => setTournamentForm({ ...tournamentForm, min_increment: e.target.value })} required />
              </div>
              <button className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                Create Tournament
              </button>
            </form>
          )}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <form onSubmit={handleTeamSubmit} className="space-y-6">
              <select className={inputStyles} onChange={(e) => setSelectedTournament(e.target.value)} required>
                <option value="">Select Target Tournament</option>
                {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input className={inputStyles} placeholder="Team Name" value={teamForm.name} onChange={(e)=>setTeamForm({...teamForm, name: e.target.value})} required />
                <input className={inputStyles} placeholder="Owner Name" value={teamForm.owner_name} onChange={(e)=>setTeamForm({...teamForm, owner_name: e.target.value})} required />
                <input className={inputStyles} placeholder="City" value={teamForm.city} onChange={(e)=>setTeamForm({...teamForm, city: e.target.value})} required />
                <input type="number" className={inputStyles} placeholder="Total Purse (Cr)" value={teamForm.purse} onChange={(e)=>setTeamForm({...teamForm, purse: e.target.value})} required />
              </div>
              <input type="file" className={inputStyles} accept="image/*" onChange={(e)=>setTeamForm({...teamForm, logo: e.target.files[0]})} required />
              <button className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform">
                Register Team
              </button>
            </form>
          )}

          {/* PLAYER TAB */}
          {activeTab === "player" && (
            <div className="space-y-8">
              {/* Individual Player Form */}
              <form onSubmit={handlePlayerSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <UserPlus size={24} className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Add Individual Player</h3>
                </div>

                <select className={inputStyles} onChange={(e) => setSelectedTournament(e.target.value)} required>
                  <option value="">Select Tournament</option>
                  {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input className={inputStyles} placeholder="Full Name" value={playerForm.name} onChange={(e)=>setPlayerForm({...playerForm, name: e.target.value})} required />
                  <input type="number" className={inputStyles} placeholder="Age" value={playerForm.age} onChange={(e)=>setPlayerForm({...playerForm, age: e.target.value})} required />
                  <input className={inputStyles} placeholder="Country" value={playerForm.country} onChange={(e)=>setPlayerForm({...playerForm, country: e.target.value})} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select className={inputStyles} value={playerForm.role} onChange={(e)=>setPlayerForm({...playerForm, role: e.target.value})} required>
                    <option value="">Select Role</option>
                    <option>Batsman</option><option>Bowler</option><option>All-rounder</option><option>Wicket-keeper</option>
                  </select>
                  <select className={inputStyles} value={playerForm.category} onChange={(e)=>setPlayerForm({...playerForm, category: e.target.value})} required>
                    <option value="">Select Tier/Category</option>
                    <option>A</option><option>B</option><option>C</option>
                  </select>
                </div>
                <input type="number" className={inputStyles} placeholder="Base Price (Lakhs)" value={playerForm.base_price} onChange={(e)=>setPlayerForm({...playerForm, base_price: e.target.value})} required />
                <input type="file" className={inputStyles} accept="image/*" onChange={(e)=>setPlayerForm({...playerForm, photo: e.target.files[0]})} required />
                <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform">
                  Add Player to Pool
                </button>
              </form>

              {/* Excel Upload Section */}
              <div className="border-t border-slate-700 pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileSpreadsheet size={24} className="text-green-400" />
                  <h3 className="text-xl font-bold text-white">Bulk Upload Players via Excel</h3>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                  <p className="text-slate-400 mb-4">
                    Upload an Excel file (.xlsx, .xls) with player data. The file should have columns for:
                    <span className="text-slate-300 font-medium"> name, age, role, category, base_price, country</span>
                  </p>

                  <div className="space-y-4">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      className={`${inputStyles} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700`}
                      disabled={isUploadingExcel}
                    />

                    {isUploadingExcel && (
                      <div className="flex items-center gap-3 text-blue-400">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                        Processing Excel file...
                      </div>
                    )}

                    <div className="text-sm text-slate-500">
                      <p><strong>Note:</strong> Photos cannot be uploaded via Excel. Add player photos individually after bulk upload.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* START TAB */}
          {activeTab === "start" && (
            <div className="py-10 text-center space-y-8">
              <div className="inline-flex p-6 rounded-full bg-rose-500/10 text-rose-500 mb-4">
                <Rocket size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Ready for Kickoff?</h2>
                <p className="text-slate-400">Select your tournament to open the live bidding floor.</p>
              </div>
              <select className={`${inputStyles} max-w-md mx-auto text-center`} onChange={(e) => setSelectedTournament(e.target.value)}>
                <option value="">Select Tournament to Launch</option>
                {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button onClick={handleStartAuction} className="w-full max-w-md py-6 bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl font-black text-2xl shadow-xl shadow-rose-900/40 hover:scale-105 transition-transform">
                START LIVE AUCTION
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}