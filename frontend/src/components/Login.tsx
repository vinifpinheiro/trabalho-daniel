import { useState } from "react";

import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3333/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((resp) => {
      return resp.json();
    });

    if (response.length >= 1) {
      // Navega para a rota '/produto'
      navigate("/produto", { state: { userId: response[0].id } });
    } else {
      alert("Usuário/senha inválidos");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-300 to-red-400">
      <div className="bg-white p-8 rounded-lg drop-shadow-2xl w-auto flex flex-row items-center">
        <div> <img src="./public/logo.jpg" className="flex flex-wrap  w-64 mr-10" /></div>
        <form onSubmit={handleLogin}>
          <div className="mb-">
             <h2 className="text-2xl font-bold relative text-black ">Login</h2>
            <label htmlFor="username" className="block mb-1 font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Login"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Senha"
            />
          </div>
          /* Botão + Animação */
          <button
        type="submit"
        className="relative flex items-center justify-center overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group h-10 w-48 mx-auto">
        <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
        <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
        <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
        <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
        </span>
        <span className="relative text-white">Login</span>
        </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
