import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

import {
  Trophy,
  Users,
  UserPlus,
  Rocket,
  FileSpreadsheet,
} from "lucide-react";

export default function SetupAuction() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tournament");
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");

  // ================= TOURNAMENT =================
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    sport: "Cricket",
    logo: null,
    auction_date: "",
    max_teams: "",
    purse: "",
    min_increment: "",
  });

  // ================= TEAM =================
  const [teamForm, setTeamForm] = useState({
    name: "",
    owner_name: "",
    logo: null,
    purse: "",
    city: "",
  });

  // ================= PLAYER =================
  const [playerForm, setPlayerForm] = useState({
    name: "",
    photo: null,
    age: "",
    role: "",
    category: "",
    base_price: "",
    country: "",
  });

  const [isUploadingExcel, setIsUploadingExcel] = useState(false);

  // ================= FETCH TOURNAMENTS =================
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

  // =========================================================
  // CREATE TOURNAMENT
  // =========================================================
  const handleTournamentSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", tournamentForm.name);
      formData.append("sport", tournamentForm.sport);
      formData.append("auction_date", tournamentForm.auction_date);
      formData.append("max_teams", tournamentForm.max_teams);
      formData.append("purse", tournamentForm.purse);
      formData.append("min_increment", tournamentForm.min_increment);

      if (tournamentForm.logo) {
        formData.append("logo", tournamentForm.logo);
      }

      const res = await api.post("/tournaments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Tournament Created Successfully!");

      // AUTO SELECT NEW TOURNAMENT
      setSelectedTournament(res.data.id);

      // RESET FORM
      setTournamentForm({
        name: "",
        sport: "Cricket",
        logo: null,
        auction_date: "",
        max_teams: "",
        purse: "",
        min_increment: "",
      });

      // REFRESH TOURNAMENTS
      await fetchTournaments();

      // GO TO TEAM TAB
      setActiveTab("team");
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.error ||
          "Tournament creation failed"
      );
    }
  };

  // =========================================================
  // CREATE TEAM
  // =========================================================
  const handleTeamSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTournament) {
      return alert("Please select tournament");
    }

    try {
      const formData = new FormData();

      formData.append("tournament_id", selectedTournament);
      formData.append("name", teamForm.name);
      formData.append("owner_name", teamForm.owner_name);
      formData.append("purse", teamForm.purse);
      formData.append("city", teamForm.city);

      if (teamForm.logo) {
        formData.append("logo", teamForm.logo);
      }

      await api.post("/teams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Team Created Successfully!");

      setTeamForm({
        name: "",
        owner_name: "",
        logo: null,
        purse: "",
        city: "",
      });

      // GO TO PLAYER TAB
      setActiveTab("player");
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.error ||
          "Team creation failed"
      );
    }
  };

  // =========================================================
  // CREATE PLAYER
  // =========================================================
  const handlePlayerSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTournament) {
      return alert("Please select tournament");
    }

    try {
      const formData = new FormData();

      formData.append("tournament_id", selectedTournament);
      formData.append("name", playerForm.name);
      formData.append("age", playerForm.age);
      formData.append("role", playerForm.role);
      formData.append("category", playerForm.category);
      formData.append("base_price", playerForm.base_price);
      formData.append("country", playerForm.country);

      if (playerForm.photo) {
        formData.append("photo", playerForm.photo);
      }

      await api.post("/players", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Player Added Successfully!");

      setPlayerForm({
        name: "",
        photo: null,
        age: "",
        role: "",
        category: "",
        base_price: "",
        country: "",
      });

      // GO TO START TAB
      setActiveTab("start");
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.error ||
          "Player creation failed"
      );
    }
  };

  // =========================================================
  // START AUCTION
  // =========================================================
  const handleStartAuction = () => {
    if (!selectedTournament) {
      return alert("Please select tournament");
    }

    navigate(`/dashboard?tournament=${selectedTournament}`);
  };

  // =========================================================
  // EXCEL UPLOAD
  // =========================================================
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!selectedTournament) {
      return alert("Please select tournament first");
    }

    setIsUploadingExcel(true);

    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const worksheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      for (const row of jsonData) {
        const playerData = {
          tournament_id: selectedTournament,
          name: row.name || row.Name,
          age: row.age || row.Age,
          role: row.role || row.Role,
          category: row.category || row.Category,
          base_price:
            row.base_price || row.Base_Price,
          country: row.country || row.Country,
        };

        await api.post("/players", playerData);
      }

      alert("Excel Upload Successful!");

      setActiveTab("start");
    } catch (err) {
      console.log(err);

      alert("Excel upload failed");
    } finally {
      setIsUploadingExcel(false);
    }
  };

  // =========================================================
  // TAB BUTTON
  // =========================================================
  const TabButton = ({
    id,
    label,
    icon: Icon,
    color,
  }) => {
    const isActive = activeTab === id;

    return (
      <button
        type="button"
        onClick={() => setActiveTab(id)}
        className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 font-semibold overflow-hidden ${
          isActive
            ? "text-white"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className={`absolute inset-0 bg-gradient-to-r ${color} -z-10`}
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.6,
            }}
          />
        )}

        <Icon size={20} />
        {label}
      </button>
    );
  };

  const inputStyles =
    "w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white";

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">

      {/* HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          BIDARENA
        </h1>

        <p className="text-slate-400 mt-3">
          Tournament Management Console
        </p>
      </header>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <TabButton
          id="tournament"
          label="Tournament"
          icon={Trophy}
          color="from-blue-600 to-cyan-500"
        />

        <TabButton
          id="team"
          label="Team"
          icon={Users}
          color="from-green-600 to-emerald-500"
        />

        <TabButton
          id="player"
          label="Player"
          icon={UserPlus}
          color="from-purple-600 to-indigo-500"
        />

        <TabButton
          id="start"
          label="Launch"
          icon={Rocket}
          color="from-rose-600 to-orange-500"
        />
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-700">

        {/* ================================================= */}
        {/* TOURNAMENT */}
        {/* ================================================= */}
        {activeTab === "tournament" && (
          <form
            onSubmit={handleTournamentSubmit}
            className="space-y-6"
          >
            <input
              className={inputStyles}
              placeholder="Tournament Name"
              value={tournamentForm.name}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  name: e.target.value,
                })
              }
              required
            />

            <select
              className={inputStyles}
              value={tournamentForm.sport}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  sport: e.target.value,
                })
              }
            >
              <option>Cricket</option>
              <option>Football</option>
              <option>Kabaddi</option>
            </select>

            <input
              type="datetime-local"
              className={inputStyles}
              value={tournamentForm.auction_date}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  auction_date: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              className={inputStyles}
              placeholder="Max Teams"
              value={tournamentForm.max_teams}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  max_teams: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              className={inputStyles}
              placeholder="Purse"
              value={tournamentForm.purse}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  purse: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              className={inputStyles}
              placeholder="Min Increment"
              value={tournamentForm.min_increment}
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  min_increment: e.target.value,
                })
              }
              required
            />

            <input
              type="file"
              className={inputStyles}
              accept="image/*"
              onChange={(e) =>
                setTournamentForm({
                  ...tournamentForm,
                  logo: e.target.files[0],
                })
              }
            />
            <p className="text-sm text-gray-500">
              Logo is optional. Leave empty to skip upload.
            </p>

            <button className="w-full py-4 rounded-2xl bg-blue-600 font-bold">
              Create Tournament
            </button>
          </form>
        )}

        {/* ================================================= */}
        {/* TEAM */}
        {/* ================================================= */}
        {activeTab === "team" && (
          <form
            onSubmit={handleTeamSubmit}
            className="space-y-6"
          >
            <select
              className={inputStyles}
              value={selectedTournament}
              onChange={(e) =>
                setSelectedTournament(e.target.value)
              }
              required
            >
              <option value="">
                Select Tournament
              </option>

              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              className={inputStyles}
              placeholder="Team Name"
              value={teamForm.name}
              onChange={(e) =>
                setTeamForm({
                  ...teamForm,
                  name: e.target.value,
                })
              }
              required
            />

            <input
              className={inputStyles}
              placeholder="Owner Name"
              value={teamForm.owner_name}
              onChange={(e) =>
                setTeamForm({
                  ...teamForm,
                  owner_name: e.target.value,
                })
              }
              required
            />

            <input
              className={inputStyles}
              placeholder="City"
              value={teamForm.city}
              onChange={(e) =>
                setTeamForm({
                  ...teamForm,
                  city: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              className={inputStyles}
              placeholder="Purse"
              value={teamForm.purse}
              onChange={(e) =>
                setTeamForm({
                  ...teamForm,
                  purse: e.target.value,
                })
              }
              required
            />

            <input
              type="file"
              className={inputStyles}
              accept="image/*"
              onChange={(e) =>
                setTeamForm({
                  ...teamForm,
                  logo: e.target.files[0],
                })
              }
              required
            />

            <button className="w-full py-4 rounded-2xl bg-green-600 font-bold">
              Register Team
            </button>
          </form>
        )}

        {/* ================================================= */}
        {/* PLAYER */}
        {/* ================================================= */}
        {activeTab === "player" && (
          <div className="space-y-10">

            {/* PLAYER FORM */}
            <form
              onSubmit={handlePlayerSubmit}
              className="space-y-6"
            >
              <select
                className={inputStyles}
                value={selectedTournament}
                onChange={(e) =>
                  setSelectedTournament(e.target.value)
                }
                required
              >
                <option value="">
                  Select Tournament
                </option>

                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <input
                className={inputStyles}
                placeholder="Player Name"
                value={playerForm.name}
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    name: e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                className={inputStyles}
                placeholder="Age"
                value={playerForm.age}
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    age: e.target.value,
                  })
                }
                required
              />

              <input
                className={inputStyles}
                placeholder="Country"
                value={playerForm.country}
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    country: e.target.value,
                  })
                }
                required
              />

              <select
                className={inputStyles}
                value={playerForm.role}
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    role: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Role</option>
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-rounder</option>
                <option>Wicket-keeper</option>
              </select>

              <select
                className={inputStyles}
                value={playerForm.category}
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select Category
                </option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>

              <input
                type="number"
                className={inputStyles}
                placeholder="Base Price"
                value={playerForm.base_price}
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    base_price: e.target.value,
                  })
                }
                required
              />

              <input
                type="file"
                className={inputStyles}
                accept="image/*"
                onChange={(e) =>
                  setPlayerForm({
                    ...playerForm,
                    photo: e.target.files[0],
                  })
                }
                required
              />

              <button className="w-full py-4 rounded-2xl bg-purple-600 font-bold">
                Add Player
              </button>
            </form>

            {/* EXCEL */}
            <div className="border-t border-slate-700 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <FileSpreadsheet />
                <h2 className="text-2xl font-bold">
                  Excel Upload
                </h2>
              </div>

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className={inputStyles}
                disabled={isUploadingExcel}
              />

              {isUploadingExcel && (
                <p className="mt-3 text-blue-400">
                  Uploading players...
                </p>
              )}
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* START */}
        {/* ================================================= */}
        {activeTab === "start" && (
          <div className="text-center space-y-6">
            <Rocket
              size={60}
              className="mx-auto text-rose-500"
            />

            <h2 className="text-4xl font-bold">
              Ready To Start Auction
            </h2>

            <select
              className={inputStyles}
              value={selectedTournament}
              onChange={(e) =>
                setSelectedTournament(e.target.value)
              }
            >
              <option value="">
                Select Tournament
              </option>

              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleStartAuction}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 text-2xl font-black"
            >
              START LIVE AUCTION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}