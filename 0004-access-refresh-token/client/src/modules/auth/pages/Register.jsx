import React, { useState } from "react";
import useApi from "../../shared/useApi";
import { useAuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router";

const register = () => {
  const api = useApi();
  const authContext = useAuthContext();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    console.log(response.data);

    authContext.setAccessToken(response.data.accessToken);
    authContext.setUser(response.data.data.user);

    navigate("/profile");
  }

  return (
    <main>
      <form className="flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded-sm"
          type="text"
          value={name}
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded-sm"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          className="border p-2 rounded-sm"
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="border p-2 bg-blue-200 rounded-sm">
          Register
        </button>
      </form>
    </main>
  );
};

export default register;
