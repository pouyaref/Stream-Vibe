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
import { BsMoon, BsSun, BsCalendarDate, BsHeart, BsHeartFill } from "react-icons/bs";
import { IoEarth } from "react-icons/io5";
import { RiMovie2Line } from "react-icons/ri";

const Header = ({ darkMode, setDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const searchRef = useRef(null);
  const modalRef = useRef(null);

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

  const openMovieModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    setShowSearchResults(false);
    setSearchQuery("");
    // Check if movie is bookmarked (would come from your state management)
    setIsBookmarked(false);
    setIsFavorite(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
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
              <a href="#" className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg">
                <FaHome className="text-lg" /> Home
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg">
                <FaFilm className="text-lg" /> Movies
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg">
                <FaTv className="text-lg" /> TV Shows
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1 hover:bg-opacity-10 hover:bg-primary rounded-lg">
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
                    darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                  } w-64 transition-all duration-200`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                />
                {searchQuery ? (
                  <button
                    className={`btn btn-square ${
                      darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"
                    } border-gray-700`}
                    onClick={clearSearch}
                  >
                    <FaTimes />
                  </button>
                ) : (
                  <button
                    className={`btn btn-square ${
                      darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"
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
                        >
                          <a
                            className={`flex items-center p-3 hover:bg-opacity-10 hover:bg-primary rounded-lg transition-colors ${
                              darkMode ? "hover:text-white" : "hover:text-gray-900"
                            }`}
                            onClick={() => openMovieModal(movie)}
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
                              <div className="font-semibold line-clamp-1">{movie.title}</div>
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <FaStar className="text-yellow-400 mr-1" />
                                {movie.imdb_rating || 'N/A'}
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
                      <p className="text-sm opacity-70">Try a different search term</p>
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
                      darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                    } w-full`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className={`btn btn-square ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
                  }`}>
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
                              darkMode ? "hover:text-white" : "hover:text-gray-900"
                            }`}
                            onClick={() => openMovieModal(movie)}
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
                              <div className="font-semibold line-clamp-1">{movie.title}</div>
                              <div className="text-xs opacity-70">{movie.year}</div>
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

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMovie && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            {/* Slide-in panel */}
            <motion.div
              ref={modalRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={`fixed inset-y-0 right-0 z-50 w-full max-w-md shadow-2xl overflow-y-auto ${
                darkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className="relative h-full">
                {/* Movie backdrop */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover blur-sm opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  
                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
                      darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
                    } shadow-lg`}
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>

                {/* Movie content */}
                <div className="p-6 -mt-16 relative z-10">
                  {/* Movie poster and actions */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-shrink-0 relative group">
                      <img
                        src={selectedMovie.poster}
                        alt={selectedMovie.title}
                        className="w-32 h-48 rounded-lg shadow-xl object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                        }}
                      />
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity">
                        <FaPlay className="text-3xl text-white" />
                      </button>
                    </div>
                    
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-1">
                        {selectedMovie.title} <span className="opacity-70">({selectedMovie.year})</span>
                      </h2>
                      
                      {/* Rating and metadata */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {selectedMovie.imdb_rating && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                            <FaImdb className="text-lg" /> {selectedMovie.imdb_rating}
                          </span>
                        )}
                        
                        {selectedMovie.country && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                            <IoEarth className="text-lg" /> {selectedMovie.country}
                          </span>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          className={`btn btn-primary btn-sm flex-1 gap-2 ${
                            darkMode ? "bg-primary hover:bg-primary/90" : "bg-primary hover:bg-primary/90"
                          }`}
                        >
                          <FaPlay /> Watch Now
                        </button>
                        
                        <button
                          onClick={toggleBookmark}
                          className={`btn btn-square btn-sm ${
                            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {isBookmarked ? (
                            <FaSolidBookmark className="text-primary" />
                          ) : (
                            <FaRegBookmark />
                          )}
                        </button>
                        
                        <button
                          onClick={toggleFavorite}
                          className={`btn btn-square btn-sm ${
                            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {isFavorite ? (
                            <BsHeartFill className="text-red-500" />
                          ) : (
                            <BsHeart />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Genres */}
                  {selectedMovie.genres && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-70">
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.genres.map((genre, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${
                              darkMode
                                ? "bg-purple-900/50 text-purple-300"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plot */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-70">
                      Overview
                    </h3>
                    <p className="opacity-90">
                      {selectedMovie.plot || "No overview available."}
                    </p>
                  </div>

                  {/* Cast (mock data) */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70">
                      Cast
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gray-600/20 mb-2"></div>
                          <span className="text-xs">Actor {item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;