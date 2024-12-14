import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    Orgname: "", // Add Orgname to the state
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Data:", data); // Debugging log

    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      console.log(res.message); // Debugging log
      alert(res.message); // Notify the user of success
      navigate("/login");
    } catch (error) {
      console.error("Error Response:", error.response ? error.response.data : error.message);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-lg flex rounded-lg shadow-lg">
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg p-10">
          <form className="flex flex-col items-center w-3/4 mb-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl mt-0 mb-6">Create Account</h1>
            <input
              type="text"
              placeholder="First Name"
              name="FirstName"
              onChange={handleChange}
              value={data.FirstName}
              autoComplete="given-name" // Added autocomplete
              required
              className="outline-none border-none w-full p-5 rounded-lg bg-[#e5efff] my-4 text-base"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="LastName"
              onChange={handleChange}
              value={data.LastName}
              autoComplete="family-name" // Added autocomplete
              required
              className="outline-none border-none w-full p-5 rounded-lg bg-[#e5efff] my-4 text-base"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              autoComplete="email" // Added autocomplete
              required
              className="outline-none border-none w-full p-5 rounded-lg bg-[#e5efff] my-4 text-base"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              autoComplete="new-password" // Added autocomplete
              required
              className="outline-none border-none w-full p-5 rounded-lg bg-[#e5efff] my-4 text-base"
            />
            <input
              type="text"
              placeholder="Organization Name"
              name="Orgname" // Name should be Orgname
              onChange={handleChange}
              value={data.Orgname} // Bind Orgname state
              autoComplete="organization" // Added autocomplete
              className="outline-none border-none w-full p-5 rounded-lg bg-[#e5efff] my-4 text-base"
            />
            {error && (
              <div className="w-full p-4 my-2 text-sm bg-red-500 text-white rounded-md text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="border-none outline-none py-4 px-6 bg-[#6469ff] text-white rounded-full font-bold text-base my-4 w-full"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
