import { useState } from "react";
import api from "../services/api";

export default function RegisterPlayer(){

const [player,setPlayer]=useState({
name:"",
role:"",
base_price:""
});

const submit=async(e)=>{
e.preventDefault();

await api.post("/player/create",player);

alert("Player Added");
};

return(
<form onSubmit={submit} className="p-10 space-y-4">

<input placeholder="Player Name"/>

<select>
<option>Batsman</option>
<option>Bowler</option>
<option>All Rounder</option>
</select>

<input placeholder="Base Price"/>

<button>Add Player</button>

</form>
)
}