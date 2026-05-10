import { Link } from "react-router-dom";

export default function Sidebar(){

return(
<div className="w-64 min-h-screen glass p-6">

<h1 className="text-2xl font-bold mb-8 text-yellow-400">
Auction Pro
</h1>

<div className="flex flex-col gap-4">

<Link to="/dashboard">Dashboard</Link>
<Link to="/teams">Teams</Link>
<Link to="/players">Players</Link>
<Link to="/auction/1">Live Auction</Link>
<Link to="/results">Results</Link>
<Link to="/analytics">Analytics</Link>

</div>

</div>
)
}