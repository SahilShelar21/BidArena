export default function TeamBidCard({team,onBid}){

return(
<div className="glass p-4 rounded-xl">

<h2 className="font-bold text-xl">
{team.name}
</h2>

<p className="text-green-400 mt-2">
₹ {team.purse}
</p>

<button
onClick={onBid}
className="btn bg-yellow-500 text-black mt-4 w-full"
>
Bid +50K
</button>

</div>
)
}