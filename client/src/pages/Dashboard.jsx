import { useEffect, useState } from "react";
import {
  Trophy,
  Play,
  Gavel,
  Timer,
  IndianRupee,
  History,
  ChevronRight,
  Plus,
  Users,
  User,
  RotateCcw,
  Ban,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuctionDashboard() {
  /* =========================
      DEMO PLAYERS
  ========================= */
  const players = [
    {
      id: 1,
      name: "Virat Kohli",
      role: "Batsman",
      basePrice: 20000000,
      image:
        "https://documents.iplt20.com/ipl/IPLHeadshot2024/2.png",
    },
    {
      id: 2,
      name: "Rohit Sharma",
      role: "Batsman",
      basePrice: 18000000,
      image:
        "https://documents.iplt20.com/ipl/IPLHeadshot2024/6.png",
    },
    {
      id: 3,
      name: "Jasprit Bumrah",
      role: "Bowler",
      basePrice: 17000000,
      image:
        "https://documents.iplt20.com/ipl/IPLHeadshot2024/9.png",
    },
    {
      id: 4,
      name: "Hardik Pandya",
      role: "All Rounder",
      basePrice: 16000000,
      image:
        "https://documents.iplt20.com/ipl/IPLHeadshot2024/54.png",
    },
  ];

  /* =========================
      TEAMS
  ========================= */
  const [teams, setTeams] = useState([
    {
      name: "Mumbai Titans",
      logo: "🟦",
      purse: 120000000,
      players: [],
    },
    {
      name: "Royal Kings",
      logo: "🟥",
      purse: 100000000,
      players: [],
    },
    {
      name: "Delhi Capitals",
      logo: "🟪",
      purse: 95000000,
      players: [],
    },
    {
      name: "Chennai Stars",
      logo: "🟨",
      purse: 140000000,
      players: [],
    },
  ]);

  /* =========================
      STATES
  ========================= */
  const [selectedPlayerId, setSelectedPlayerId] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState({
    ...players[0],
    currentBid: players[0].basePrice,
    team: "",
  });

  const [timer, setTimer] = useState(15);
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const [isUnsold, setIsUnsold] = useState(false);
  const [manualBid, setManualBid] = useState("");
  const [history, setHistory] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);
  const [previewTeam, setPreviewTeam] = useState(teams[0]);

  /* =========================
      TIMER
  ========================= */
  useEffect(() => {
    if (!auctionStarted || isSold || isUnsold) return;

    if (timer === 0) {
      if (currentPlayer.team) {
        handleSold();
      } else {
        handleUnsold();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, auctionStarted, isSold, isUnsold]);

  /* =========================
      SELECT PLAYER
  ========================= */
  const selectPlayer = (id) => {
    const p = players.find((x) => x.id === Number(id));

    setSelectedPlayerId(id);
    setCurrentPlayer({
      ...p,
      currentBid: p.basePrice,
      team: "",
    });

    setAuctionStarted(false);
    setIsSold(false);
    setIsUnsold(false);
    setHistory([]);
    setTimer(15);
  };

  /* =========================
      START
  ========================= */
  const startAuction = () => {
    setAuctionStarted(true);
    setIsSold(false);
    setIsUnsold(false);
    setTimer(15);
  };

  /* =========================
      BID
  ========================= */
  const placeBid = (teamName, amount = 500000) => {
    if (!auctionStarted || isSold || isUnsold) return;

    const bidAmount = Number(amount);
    const newBid = currentPlayer.currentBid + bidAmount;

    setCurrentPlayer((prev) => ({
      ...prev,
      currentBid: newBid,
      team: teamName,
    }));

    setHistory((prev) => [
      {
        team: teamName,
        amount: newBid,
      },
      ...prev,
    ]);

    setTimer(15);
    setManualBid("");
  };

  /* =========================
      UNDO BID
  ========================= */
  const undoBid = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    newHistory.shift();

    setHistory(newHistory);

    if (newHistory.length === 0) {
      setCurrentPlayer((prev) => ({
        ...prev,
        currentBid: prev.basePrice,
        team: "",
      }));
    } else {
      setCurrentPlayer((prev) => ({
        ...prev,
        currentBid: newHistory[0].amount,
        team: newHistory[0].team,
      }));
    }
  };

  /* =========================
      SOLD
  ========================= */
  const handleSold = () => {
    if (!currentPlayer.team) return;

    setAuctionStarted(false);
    setIsSold(true);

    setSoldPlayers((prev) => [...prev, currentPlayer]);

    setTeams((prev) =>
      prev.map((team) =>
        team.name === currentPlayer.team
          ? {
              ...team,
                              purse: team.purse - currentPlayer.currentBid,
              players: [...team.players, currentPlayer],
            }
          : team
      )
    );
  };

  /* =========================
      UNSOLD
  ========================= */
  const handleUnsold = () => {
    setAuctionStarted(false);
    setIsUnsold(true);

    setUnsoldPlayers((prev) => [...prev, currentPlayer]);
  };

  /* =========================
      CHART DATA
  ========================= */
  const highestBidPlayer =
    soldPlayers.length > 0
      ? [...soldPlayers].sort(
          (a, b) => b.currentBid - a.currentBid
        )[0]
      : null;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">
      {/* BG */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-indigo-600/20 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto p-6 grid grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="col-span-3 space-y-6">

          {/* PLAYER SELECT */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
            <h2 className="font-black mb-4 flex gap-2 items-center text-blue-400 uppercase">
              <User size={18} /> Select Player
            </h2>

            <select
              value={selectedPlayerId}
              onChange={(e) => selectPlayer(e.target.value)}
              className="w-full bg-slate-900 p-4 rounded-2xl outline-none"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* TEAMS */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
            <h2 className="font-black mb-5 text-yellow-400 uppercase flex gap-2 items-center">
              <Trophy size={18} /> Teams
            </h2>

            {teams.map((team, i) => (
              <button
                key={i}
                onClick={() => setPreviewTeam(team)}
                className="w-full text-left bg-slate-900 rounded-2xl p-4 mb-3 hover:bg-slate-800 transition"
              >
                <div className="flex gap-3 items-center">
                  <div className="text-2xl">{team.logo}</div>

                  <div>
                    <p className="font-bold">{team.name}</p>
                    <p className="text-xs text-green-400">
                      ₹{(team.purse / 10000000).toFixed(2)} Cr
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ADMIN */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
            <h2 className="font-black mb-5 text-blue-400 uppercase flex gap-2 items-center">
              <Gavel size={18} /> Admin
            </h2>

            {!isSold && !isUnsold ? (
              <>
                <button
                  onClick={startAuction}
                  className="w-full py-4 bg-blue-600 rounded-2xl font-bold mb-3"
                >
                  <div className="flex justify-center gap-2 items-center">
                    <Play size={18} /> Start Auction
                  </div>
                </button>

                <button
                  onClick={handleSold}
                  className="w-full py-4 bg-green-600 rounded-2xl font-bold mb-3"
                >
                  SOLD
                </button>

                <button
                  onClick={handleUnsold}
                  className="w-full py-4 bg-red-600 rounded-2xl font-bold"
                >
                  UNSOLD
                </button>
              </>
            ) : (
              <button
                onClick={() => selectPlayer(selectedPlayerId)}
                className="w-full py-4 bg-yellow-400 text-black rounded-2xl font-black"
              >
                <div className="flex justify-center gap-2 items-center">
                  Reset <ChevronRight size={18} />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className="col-span-6 space-y-6">

          {/* PLAYER CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
            <div className="px-8 py-5 border-b border-white/10 flex justify-between">
              <h1 className="font-black text-xl">
                BidArena Live Auction
              </h1>

              <div
                className={`px-5 py-2 rounded-full font-black ${
                  timer <= 5
                    ? "bg-red-600 animate-pulse"
                    : "bg-white/10"
                }`}
              >
                <div className="flex gap-2 items-center">
                  <Timer size={18} /> {timer}s
                </div>
              </div>
            </div>

            <div className="p-8 flex gap-8 items-center">
              <div className="relative">
                <motion.img
                  key={currentPlayer.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={currentPlayer.image}
                  className="w-60 h-60 rounded-[2rem] object-cover border-4 border-white/10"
                />

                <AnimatePresence>
                  {isSold && (
                    <motion.div
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-green-600 px-6 py-3 rounded-xl text-4xl font-black rotate-[-15deg]">
                        SOLD
                      </div>
                    </motion.div>
                  )}

                  {isUnsold && (
                    <motion.div
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-red-600 px-6 py-3 rounded-xl text-4xl font-black rotate-[-15deg]">
                        UNSOLD
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1">
                <p className="uppercase text-blue-400 font-bold">
                  {currentPlayer.role}
                </p>

                <h1 className="text-6xl font-black mt-2">
                  {currentPlayer.name}
                </h1>

                <div className="mt-10">
                  <p className="text-slate-400 text-sm">
                    Current Bid
                  </p>

                  <h2 className="text-5xl font-black text-green-400">
                    ₹
                    {(currentPlayer.currentBid / 10000000).toFixed(
                      2
                    )}{" "}
                    Cr
                  </h2>
                </div>
              </div>
            </div>

            <div
              className={`px-8 py-5 font-black uppercase ${
                isSold
                  ? "bg-green-600"
                  : isUnsold
                  ? "bg-red-600"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {isSold
                ? `Sold To: ${currentPlayer.team}`
                : isUnsold
                ? "UNSOLD"
                : currentPlayer.team || "No Bids Yet"}
            </div>
          </div>

          {/* BID PANEL */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <IndianRupee
                  className="absolute left-4 top-4 text-slate-500"
                  size={18}
                />

                <input
                  type="number"
                  value={manualBid}
                  onChange={(e) => setManualBid(e.target.value)}
                  placeholder="Manual Bid Amount"
                  className="w-full bg-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none"
                />
              </div>

              <button
                onClick={() =>
                  placeBid(
                    currentPlayer.team || teams[0].name,
                    manualBid
                  )
                }
                className="px-8 bg-white text-black rounded-2xl font-bold"
              >
                Raise
              </button>

              <button
                onClick={undoBid}
                className="px-5 bg-red-500 rounded-2xl"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {teams.map((team, i) => (
                <button
                  key={i}
                  onClick={() => placeBid(team.name)}
                  disabled={!auctionStarted}
                  className="bg-slate-900 rounded-2xl p-4 hover:bg-yellow-400 hover:text-black transition"
                >
                  <p className="text-xs truncate">{team.name}</p>
                  <div className="flex justify-center gap-1 mt-2 font-bold">
                    <Plus size={14} /> 5L
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <h3 className="font-bold mb-4">Sold / Unsold</h3>

              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${soldPlayers.length * 20}%`,
                    }}
                  />
                </div>

                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${unsoldPlayers.length * 20}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <h3 className="font-bold mb-4">Team Purse Left</h3>

              {teams.map((team, i) => (
                <div key={i} className="mb-3">
                  <p className="text-xs mb-1">{team.name}</p>
                  <div className="h-3 bg-slate-800 rounded-full">
                    <div
                      className="h-3 bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          (team.purse / 140000000) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <h3 className="font-bold mb-4">
                Highest Bid Player
              </h3>

              {highestBidPlayer ? (
                <div className="text-center">
                  <img
                    src={highestBidPlayer.image}
                    className="w-20 h-20 rounded-full mx-auto mb-3"
                  />
                  <p className="font-bold">
                    {highestBidPlayer.name}
                  </p>
                  <p className="text-green-400">
                    ₹
                    {(
                      highestBidPlayer.currentBid / 10000000
                    ).toFixed(2)}{" "}
                    Cr
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  No sold players yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-3 space-y-6">

          {/* TEAM PREVIEW */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
            <h2 className="font-black text-yellow-400 mb-5 uppercase flex gap-2 items-center">
              <Users size={18} /> Team Preview
            </h2>

            <div className="text-center mb-5">
              <div className="text-5xl mb-2">
                {previewTeam.logo}
              </div>
              <h3 className="text-xl font-black">
                {previewTeam.name}
              </h3>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {previewTeam.players.length === 0 ? (
                <p className="text-slate-400 text-sm text-center">
                  No players bought yet
                </p>
              ) : (
                previewTeam.players.map((p, i) => (
                  <div
                    key={i}
                    className="bg-slate-900 rounded-2xl p-3 flex gap-3 items-center"
                  >
                    <img
                      src={p.image}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-slate-400">
                        {p.role}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* HISTORY */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
            <h2 className="font-black text-slate-300 mb-5 uppercase flex gap-2 items-center">
              <History size={18} /> Bid Log
            </h2>

            {history.map((bid, i) => (
              <div
                key={i}
                className="mb-3 bg-slate-900 rounded-2xl p-4 border-l-4 border-green-500"
              >
                <p className="text-xs text-slate-400">
                  {bid.team}
                </p>
                <p className="font-bold text-green-400">
                  ₹{(bid.amount / 10000000).toFixed(2)} Cr
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}