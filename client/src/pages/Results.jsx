import Sidebar from "../components/Sidebar";

export default function Results(){

return(
<div className="flex">

<Sidebar/>

<div className="flex-1 p-8">

<h1 className="text-4xl font-bold mb-8">
Auction Results
</h1>

<div className="glass p-6 rounded-2xl">

<table className="w-full text-center">

<thead>
<tr>
<th>Player</th>
<th>Team</th>
<th>Price</th>
</tr>
</thead>

<tbody>
<tr>
<td>Virat</td>
<td>RCB</td>
<td>₹ 7 Cr</td>
</tr>
</tbody>

</table>

</div>

</div>
</div>
)
}