import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TeamBidCard from "../components/TeamBidCard";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://bidarena.onrender.com", {
  transports: ["websocket", "polling"]
});

export default function AuctionRoom(){

const [bid,setBid] = useState(2000000);
const [timer,setTimer] = useState(10);

const teams = [
{id:1,name:"Mumbai",purse:"5 Cr"},
{id:2,name:"Chennai",purse:"7 Cr"},
{id:3,name:"RCB",purse:"4 Cr"}
];

useEffect(()=>{

socket.emit("joinRoom",{tournamentId:1});

socket.on("bidUpdate",(data)=>{
 setBid(data.current_bid);
});

socket.on("timer",(sec)=>{
 setTimer(sec);
});

socket.on("playerSold",(data)=>{
 alert("Player Sold ₹"+data.price);
});

},[]);

const placeBid=(teamId)=>{
 socket.emit("placeBid",{
 tournamentId:1,
 teamId
 });
};

return(
<div className="flex">

<Sidebar/>

<div className="flex-1 p-6 grid grid-cols-12 gap-6">

{/* LEFT PANEL */}
<div className="col-span-3 glass p-6 rounded-2xl">

<h2 className="text-2xl font-bold mb-4">
Admin Controls
</h2>

<button
className="btn bg-blue-600 w-full mb-3"
onClick={()=>socket.emit("startAuction",{
tournamentId:1,
playerId:1,
basePrice:2000000
})}
>
Start Auction
</button>

<button
className="btn bg-green-600 w-full mb-3"
onClick={()=>socket.emit("markSold",{tournamentId:1})}
>
Sold
</button>

<button
className="btn bg-red-600 w-full"
onClick={()=>socket.emit("markUnsold",{tournamentId:1})}
>
Unsold
</button>

</div>

{/* CENTER */}
<div className="col-span-6 glass p-8 rounded-2xl text-center">

<div className="w-40 h-40 rounded-full bg-gray-700 mx-auto mb-6"></div>

<h1 className="text-5xl font-bold">
{player.name}
</h1>

<p className="text-xl text-gray-300 mt-2">
{player.role}
</p>

<h2 className="text-6xl font-bold text-yellow-400 mt-8">
₹ {bid.toLocaleString()}
</h2>

<div className="mt-8 text-4xl text-red-400 font-bold">
{timer}s
</div>

</div>

{/* RIGHT */}
<div className="col-span-3 flex flex-col gap-4">

{teams.map(team=>(
<TeamBidCard
key={team.id}
team={team}
onBid={()=>placeBid(team.id)}
/>
))}

</div>

</div>
</div>
)
}