import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
// ADDED 'Play' to the imports below to fix the error
import { Gavel, ChevronRight, Zap, Trophy, Users, Star, IndianRupee, TrendingUp, ShieldCheck, Play } from "lucide-react";

export default function CrazyHome() {
  const floatingAction = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans">
      
      {/* --- PREMIUM STADIUM BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000')] bg-cover bg-fixed bg-center opacity-30 grayscale-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-[#020617] to-indigo-900/30" />
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full" />
      </div>

      {/* --- TOP BROADCAST NAV --- */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-20 py-5 backdrop-blur-xl border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 360 }}
            className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)]"
          >
            <Gavel className="text-black" size={24} />
          </motion.div>
          <span className="text-3xl font-black italic tracking-tighter uppercase leading-none">
            BidArena <br/> <span className="text-yellow-400 text-xs not-italic uppercase font-black tracking-[0.3em]">Auction Platform</span>
          </span>
        </div>
        
        <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          {["Market", "Live Draft", "Teams", "Stats"].map(i => (
            <a key={i} className="hover:text-yellow-400 transition-all cursor-pointer relative group">
              {i}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block px-6 py-2 text-xs font-black uppercase tracking-widest hover:text-yellow-400 transition">Sign In</button>
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95">
            Join the Arena
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 pt-16 pb-24 px-6 lg:px-20 max-w-[1500px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Broadcast Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Star size={12} fill="currentColor" /> Live
            </div>
            <h1 className="text-7xl lg:text-[100px] font-black leading-[0.85] italic uppercase tracking-tighter mb-8">
              THE ARENA <br /> IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">OPEN.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed border-l-4 border-blue-600 pl-6">
              Join the most exciting player auction platform where users bid for top talent, create powerful teams, and compete in real-time. Every bid matters, every choice counts. <span className="text-white font-bold italic">The Future of Sports Auctions</span>
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Link to="/setup" className="group flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl text-lg font-black italic uppercase tracking-widest shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all">
                Start Your Auction <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
              {/* Play icon is now defined */}
              <button className="flex items-center gap-3 px-8 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                <Play size={16} fill="currentColor" /> Preview
              </button>
            </div>
          </motion.div>

          {/* Right: The "Broadcast Dashboard" UI */}
          <div className="lg:col-span-6 relative">
            <motion.div variants={floatingAction} animate="animate" className="relative z-20">
              {/* Main Card with a neon pulse border */}
              <div className="bg-[#0f172a]/80 backdrop-blur-2xl border-[1px] border-white/20 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] relative group">
                {/* Header Bar */}
                <div className="bg-blue-600 px-8 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Bidding Engine</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-200">Session ID: #7729</span>
                </div>

                <div className="p-8">
                  <div className="flex gap-8 mb-10 items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400 rounded-3xl blur-xl opacity-20" />
                      <img 
                        src="https://p.imgci.com/db/PICTURES/CMS/316600/316605.png" 
                        className="relative w-32 h-32 bg-slate-800 rounded-3xl object-cover border-2 border-white/10" 
                        alt="Player"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-lg text-[10px] font-black italic">ELITE</div>
                    </div>
                    <div>
                      <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Virat Kohli</h3>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Right Hand Batsman</p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-bold">BASE: 2.0 Cr</div>
                        <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-bold">FORM: 🔥🔥🔥</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing HUD */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-yellow-400/30 transition-colors">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Current Highest Bid</p>
                      <div className="text-4xl font-black text-yellow-400 italic flex items-center gap-1">
                        <IndianRupee size={24} /> 5.25 <span className="text-sm uppercase ml-1">Cr</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Leading Team</p>
                      <div className="text-3xl font-black text-white italic uppercase tracking-tighter">Mumbai Titans</div>
                    </div>
                  </div>

                  {/* Team Controls */}
                  <div className="grid grid-cols-4 gap-2">
                    {["RCB", "MI", "CSK", "DC"].map((t) => (
                      <button key={t} className="py-4 rounded-xl bg-white/5 border border-white/10 font-black text-xs hover:bg-blue-600 hover:border-blue-500 transition-all active:scale-95">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 blur-[80px] -z-10" />
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -bottom-20 -right-20 opacity-5 -z-10">
               <Trophy size={400} className="text-white" />
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- TRUSTED BY TICKER --- */}
      <div className="relative z-10 py-12 bg-black/40 border-y border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Official Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
             <h2 className="text-2xl font-black italic tracking-tighter uppercase">Star Sports</h2>
             <h2 className="text-2xl font-black italic tracking-tighter uppercase">ESPN Cricinfo</h2>
             <h2 className="text-2xl font-black italic tracking-tighter uppercase">Sportskeeda</h2>
             <h2 className="text-2xl font-black italic tracking-tighter uppercase">Pro Kabaddi</h2>
          </div>
        </div>
      </div>

      {/* --- FEATURE GRID --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<ShieldCheck className="text-blue-500" />}
            title="Verified Records"
            desc="Every player stat is synced with live match databases for the most realistic experience."
            delay={0.1}
          />
          <FeatureCard 
            icon={<TrendingUp className="text-yellow-500" />}
            title="Real-time Engine"
            desc="Our ultra-low latency engine ensures every bid is recorded in milliseconds."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Users className="text-emerald-500" />}
            title="Multiplayer Draft"
            desc="Host private rooms and compete with your friends to see who has the best scout eye."
            delay={0.3}
          />
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION --- */}
      <footer className="relative z-10 pb-32 text-center">
        <div className="max-w-4xl mx-auto px-6 py-20 bg-gradient-to-b from-blue-600/20 to-transparent rounded-[4rem] border border-white/5 backdrop-blur-sm">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-8">Ready to take the <span className="text-yellow-400">Gavel?</span></h2>
          <button className="px-16 py-6 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl font-black text-xl italic uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95">
            Sign Up Now & Start Bidding! →
          </button>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -10, borderColor: "rgba(255,255,255,0.2)" }}
      className="p-12 bg-white/5 rounded-[3rem] border border-white/5 transition-all group overflow-hidden relative"
    >
      {/* Decorative inner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
      
      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-xl">
        {icon}
      </div>
      <h4 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">{title}</h4>
      <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}