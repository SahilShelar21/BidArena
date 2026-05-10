import { useState } from "react";
import api from "../services/api";

export default function CreateTournament() {
  const [form, setForm] = useState({
    name: "",
    sport_type: "",
    max_teams: "",
    purse: "",
    logo: null,
  });

  const [preview, setPreview] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("sport_type", form.sport_type);
      formData.append("max_teams", form.max_teams);
      formData.append("purse", form.purse);
      formData.append("logo", form.logo);

      await api.post("/tournament/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Tournament Created Successfully");
    } catch (error) {
      console.log(error);
      alert("Error Creating Tournament");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10">
      <h1 className="text-4xl mb-8 font-bold text-blue-400">
        Create Tournament
      </h1>

      <form onSubmit={submit} className="space-y-5 max-w-xl">

        {/* Tournament Name */}
        <input
          type="text"
          placeholder="Tournament Name"
          className="w-full p-4 bg-gray-800 rounded-xl outline-none"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Sport Type */}
        <input
          type="text"
          placeholder="Sport Type"
          className="w-full p-4 bg-gray-800 rounded-xl outline-none"
          onChange={(e) =>
            setForm({ ...form, sport_type: e.target.value })
          }
        />

        {/* Max Teams */}
        <input
          type="number"
          placeholder="Max Teams"
          className="w-full p-4 bg-gray-800 rounded-xl outline-none"
          onChange={(e) =>
            setForm({ ...form, max_teams: e.target.value })
          }
        />

        {/* Purse */}
        <input
          type="number"
          placeholder="Max Purse"
          className="w-full p-4 bg-gray-800 rounded-xl outline-none"
          onChange={(e) =>
            setForm({ ...form, purse: e.target.value })
          }
        />

        {/* Logo Upload */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <label className="block mb-2 text-sm text-gray-300">
            Upload Tournament Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setForm({ ...form, logo: e.target.files[0] });
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="Preview"
              className="w-28 h-28 rounded-xl object-cover border border-blue-500"
            />
          </div>
        )}

        {/* Submit */}
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold w-full">
          Create Tournament
        </button>
      </form>
    </div>
  );
}