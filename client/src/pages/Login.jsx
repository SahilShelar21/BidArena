import { useState } from "react";
import axios from "axios";

export default function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const submit = async()=>{

const res = await axios.post(
"http://localhost:5000/api/auth/login",
{email,password}
);

localStorage.setItem("token",res.data.token);
window.location="/dashboard";
};

return(
<div className="min-h-screen flex items-center justify-center">

<div className="glass p-10 rounded-2xl w-[400px]">

<h1 className="text-3xl font-bold mb-6">
Login
</h1>

<input
placeholder="Email"
className="w-full p-3 bg-transparent border mb-4 rounded"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full p-3 bg-transparent border mb-4 rounded"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={submit}
className="btn bg-blue-600 w-full"
>
Login
</button>

</div>
</div>
)
}