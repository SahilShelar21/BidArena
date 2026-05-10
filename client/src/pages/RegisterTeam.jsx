import { useState } from "react";
import api from "../services/api";

export default function RegisterTeam(){

const [team,setTeam]=useState({
name:"",
owner:"",
city:"",
purse:""
});

const submit=async(e)=>{
e.preventDefault();

await api.post("/team/create",team);

alert("Team Added");
};

return(
<form onSubmit={submit} className="p-10 space-y-4">

<input placeholder="Team Name"
onChange={(e)=>setTeam({...team,name:e.target.value})}
/>

<input placeholder="Owner"
/>

<input placeholder="City"/>

<input placeholder="Purse"/>

<button>Add Team</button>

</form>
)
}