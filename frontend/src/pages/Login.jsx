import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/auth";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
<div className="w-full min-h-screen flex items-start justify-center bg-white mt-16"> 
  <div className="w-full max-w-lg flex rounded-lg shadow-lg"> 
    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg p-10"> 
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <h1 className="text-4xl mt-0 mb-6">Login to Your Account</h1> 
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={data.email}
          required
          className="outline-none border-none w-full p-5 rounded-lg bg-[#e5efff] my-4 text-base" 
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={data.password}
          required
          className="outline-none border-none w-full p-5 rounded-lg bg-[#e5efff] my-4 text-base" 
        />
        {error && <div className="w-full p-4 my-2 text-sm bg-red-500 text-white rounded-md text-center">{error}</div>}
        <button type="submit" className="border-none outline-none py-4 px-6 bg-[#6469ff] text-white rounded-full font-bold text-base my-4 w-full"> 
          Sign in
        </button>
      </form>
    </div>
  </div>
</div>
  );
};

export default Login;
