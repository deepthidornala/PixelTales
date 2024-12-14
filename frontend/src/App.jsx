import React from 'react';
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import { logo } from './assets';
import { Home, CreatePost, CreateText, Login, Signup } from './pages';

const App = () => {
  const user = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
        <Link to="/">
          <img src={logo} alt="logo" className="w-40 object-contain" />
        </Link>
        <div className="flex justify-end space-x-4">
          {user ? (
            <>
              <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Create Image</Link>
              <Link to="/create-text" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Create Story</Link>
              <button
                onClick={handleLogout}
                className="font-inter font-medium bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Login</Link>
              <Link to="/signup" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Sign Up</Link>
            </>
          )}
        </div>
      </header>
      <main className="sm:p-8 px-4 py-8 w-full min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/create-post" element={user ? <CreatePost /> : <Navigate replace to="/login" />} />
          <Route path="/create-text" element={user ? <CreateText /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={user ? <Navigate replace to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate replace to="/" /> : <Signup />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
