import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaTimes,
  FaHome,
  FaFilm,
  FaTv,
  FaBookmark,
  FaPlay,
  FaStar,
  FaImdb,
  FaRegBookmark,
  FaBookmark as FaSolidBookmark,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  BsMoon,
  BsSun,
  BsCalendarDate,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";
import { IoEarth } from "react-icons/io5";
import { RiMovie2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);

  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://moviesapi.ir/api/v1/movies?q=${query}`
      );
      setSearchResults(response.data.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="navbar container mx-auto px-4 max-w-7xl">
        {/* Mobile menu button */}
        <div className="navbar-start md:hidden">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo and Desktop Navigation */}
        <div className="navbar-center md:navbar-start">
          <a className="btn btn-ghost normal-case text-xl text-primary">
            <span className="font-bold">Stream</span>
            <span className="text-secondary font-bold">Vibe</span>
          </a>
          <ul className="menu menu-horizontal px-1 hidden md:flex gap-1">
            <li>
              <a
                href="#"
                className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg"
              >
                <FaHome className="text-lg" /> Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg"
              >
                <FaFilm className="text-lg" /> Movies
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg"
              >
                <FaTv className="text-lg" /> TV Shows
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg"
              >
                <FaBookmark className="text-lg" /> My List
              </a>
            </li>
          </ul>
        </div>

        {/* Search and User Actions */}
        <div className="navbar-end gap-2">
          {/* Search Bar */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className={`input input-bordered focus:outline-none focus:ring-2 focus:ring-primary ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  } w-64 transition-all duration-200`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                />
                {searchQuery ? (
                  <button
                    className={`btn btn-square ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    } border-gray-700`}
                    onClick={clearSearch}
                  >
                    <FaTimes />
                  </button>
                ) : (
                  <button
                    className={`btn btn-square ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    } border-gray-700`}
                  >
                    <FaSearch />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", damping: 20 }}
                  className={`absolute mt-2 w-full shadow-xl rounded-lg z-50 overflow-hidden ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {isSearching ? (
                    <div className="p-4 flex justify-center">
                      <span className="loading loading-spinner text-primary"></span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul className="menu p-2 max-h-96 overflow-y-auto">
                      {searchResults.map((movie) => (
                        <motion.li
                          key={movie.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => {
                            navigate(`/movie/${movie.id}`);
                          }}
                        >
                          <a
                            className={`flex items-center p-3 hover:bg-opacity-10 hover:bg-primary rounded-lg transition-colors ${
                              darkMode
                                ? "hover:text-white"
                                : "hover:text-gray-900"
                            }`}
                          >
                            <div className="avatar">
                              <div className="w-12 rounded">
                                <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/50x75?text=No+Poster";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="font-semibold line-clamp-1">
                                {movie.title}
                              </div>
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <FaStar className="text-yellow-400 mr-1" />
                                {movie.imdb_rating || "N/A"}
                                <span className="mx-2">•</span>
                                <BsCalendarDate className="mr-1" />
                                {movie.year}
                              </div>
                            </div>
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center flex flex-col items-center">
                      <RiMovie2Line className="text-3xl opacity-50 mb-2" />
                      <p>No results found</p>
                      <p className="text-sm opacity-70">
                        Try a different search term
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search */}
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <FaSearch />
            </label>
            <div
              tabIndex={0}
              className={`dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-72 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className={`input input-bordered focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    } w-full`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    className={`btn btn-square ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
              {showSearchResults && (
                <div
                  className={`mt-2 max-h-64 overflow-y-auto rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {isSearching ? (
                    <div className="p-4 flex justify-center">
                      <span className="loading loading-spinner text-primary"></span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul className="menu p-2">
                      {searchResults.map((movie) => (
                        <li key={movie.id}>
                          <a
                            className={`flex items-center p-3 hover:bg-opacity-10 hover:bg-primary rounded-lg ${
                              darkMode
                                ? "hover:text-white"
                                : "hover:text-gray-900"
                            }`}
                          >
                            <div className="avatar">
                              <div className="w-10 rounded">
                                <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/50x75?text=No+Poster";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="ml-2">
                              <div className="font-semibold line-clamp-1">
                                {movie.title}
                              </div>
                              <div className="text-xs opacity-70">
                                {movie.year}
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <BsSun className="swap-on text-xl" />
            <BsMoon className="swap-off text-xl" />
          </label>

          {/* User Profile */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center">
                <span className="font-bold">U</span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <li>
                <a className="hover:bg-opacity-10 hover:bg-primary">
                  <FaUserCircle className="text-lg" /> Profile
                </a>
              </li>
              <li>
                <a className="hover:bg-opacity-10 hover:bg-primary">
                  <FaBookmark className="text-lg" /> My List
                </a>
              </li>
              <li>
                <a className="hover:bg-opacity-10 hover:bg-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </a>
              </li>
              <li>
                <a className="hover:bg-opacity-10 hover:bg-red-500 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed inset-y-0 left-0 z-40 w-64 shadow-2xl pt-16 ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="p-4">
              <ul className="menu">
                <li>
                  <a href="#" className="flex items-center gap-3 py-3">
                    <FaHome className="text-xl" />
                    <span className="font-medium">Home</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 py-3">
                    <FaFilm className="text-xl" />
                    <span className="font-medium">Movies</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 py-3">
                    <FaTv className="text-xl" />
                    <span className="font-medium">TV Shows</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 py-3">
                    <FaBookmark className="text-xl" />
                    <span className="font-medium">My List</span>
                  </a>
                </li>
              </ul>
            </div>
            <button
              className="absolute top-4 right-4 p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaTimes className="text-xl" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
