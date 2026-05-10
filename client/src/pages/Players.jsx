import Sidebar from "../components/Sidebar";

export default function Players(){

const players = [
{name:"Virat", role:"Batsman", price:"2 Cr"},
{name:"Bumrah", role:"Bowler", price:"3 Cr"},
{name:"Rohit", role:"Batsman", price:"2.5 Cr"},
];

return(
<div className="flex">

<Sidebar/>

<div className="flex-1 p-8">

<h1 className="text-4xl font-bold mb-8">
Players
</h1>

<table className="w-full glass rounded-2xl overflow-hidden">

<thead>
<tr className="border-b">
<th className="p-4">Name</th>
<th>Role</th>
<th>Base Price</th>
</tr>
</thead>

<tbody>

{players.map((p,i)=>(
<tr key={i} className="text-center border-b border-gray-700">
<td className="p-4">{p.name}</td>
<td>{p.role}</td>
<td>{p.price}</td>
</tr>
))}

</tbody>

</table>

</div>
</div>
)
}