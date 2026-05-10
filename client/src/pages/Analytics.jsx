import Sidebar from "../components/Sidebar";

export default function Analytics(){

return(
<div className="flex">

<Sidebar/>

<div className="flex-1 p-8">

<h1 className="text-4xl font-bold mb-8">
Analytics
</h1>

<div className="grid grid-cols-2 gap-6">

<div className="glass h-80 rounded-2xl p-6">
Highest Sold Players Chart
</div>

<div className="glass h-80 rounded-2xl p-6">
Team Spending Chart
</div>

</div>

</div>
</div>
)
}