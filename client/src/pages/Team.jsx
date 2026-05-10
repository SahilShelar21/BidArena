import Sidebar from "../components/Sidebar";

export default function Teams(){

const teams = [
{name:"Mumbai", purse:"5 Cr"},
{name:"Chennai", purse:"7 Cr"},
{name:"Bangalore", purse:"4 Cr"},
];

return(
<div className="flex">

<Sidebar/>

<div className="flex-1 p-8">

<h1 className="text-4xl font-bold mb-8">
Teams
</h1>

<div className="grid grid-cols-3 gap-6">

{teams.map((team,i)=>(
<div key={i} className="glass p-6 rounded-2xl">

<h2 className="text-2xl font-bold">
{team.name}
</h2>

<p className="mt-3 text-green-400">
Purse: {team.purse}
</p>

<button className="btn bg-blue-600 mt-4">
View Squad
</button>

</div>
))}

</div>

</div>
</div>
)
}