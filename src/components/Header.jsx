import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaTimes,
  FaHome,
  FaFilm,
  FaTv,
  FaBookmark,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BsMoon, BsSun, BsCalendarDate, BsHeartFill } from "react-icons/bs";
import { RiMovie2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showGenresDropdown, setShowGenresDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const searchRef = useRef(null);
  const genresRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://moviesapi.ir/api/v1/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (genresRef.current && !genresRef.current.contains(event.target)) {
        setShowGenresDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
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

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowSearchResults(false);
    setShowGenresDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md dark:shadow-gray-800/50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              className="mobile-menu-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
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
              )}
            </button>
          </div>

          {/* Logo and Desktop Navigation */}
          <div className="flex items-center flex-1">
            <a
              href="/"
              className="flex items-center text-2xl font-bold cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/");
              }}
            >
              <span className="text-blue-600 dark:text-blue-400">Stream</span>
              <span className="text-pink-600 dark:text-pink-400">Vibe</span>
            </a>

            <nav className="hidden md:flex ml-10 space-x-1">
              <button
                onClick={() => handleNavigation("/")}
                className="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaHome className="mr-2" /> Home
              </button>
              <button
                onClick={() => handleNavigation("/movies")}
                className="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaFilm className="mr-2" /> Movies
              </button>
              <button
                onClick={() => handleNavigation("/tv-shows")}
                className="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTv className="mr-2" /> TV Shows
              </button>
              <div className="relative" ref={genresRef}>
                <button
                  onClick={() => setShowGenresDropdown(!showGenresDropdown)}
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaBookmark className="mr-2" /> Genres
                </button>
                <AnimatePresence>
                  {showGenresDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="absolute left-0 mt-2 w-56 origin-top-right rounded-md shadow-lg dark:shadow-gray-800/50 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    >
                      <div className="py-1 max-h-96 overflow-y-auto">
                        {genres.map((genre) => (
                          <button
                            key={genre.id}
                            onClick={() =>
                              handleNavigation(
                                `/genre/${genre.name}/${genre.id}`
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {genre.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Search */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  aria-label="Search movies"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {searchQuery ? (
                    <button
                      onClick={clearSearch}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  ) : (
                    <FaSearch className="text-gray-500" />
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
                    className="absolute mt-2 w-full rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  >
                    {isSearching ? (
                      <div className="p-4 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((movie) => (
                          <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() =>
                              handleNavigation(`/movie/${movie.id}`)
                            }
                            className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                              <div className="flex-shrink-0 h-16 w-12 rounded overflow-hidden">
                                <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/50x75?text=No+Poster";
                                  }}
                                />
                              </div>
                              <div className="ml-3 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {movie.title}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <BsHeartFill className="text-red-500 mr-1" />
                                  {movie.imdb_rating || "N/A"}
                                  <span className="mx-2">•</span>
                                  <BsCalendarDate className="mr-1" />
                                  {movie.year}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <RiMovie2Line className="mx-auto text-3xl text-gray-400 mb-2" />
                        <p className="font-medium">No results found</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Try a different search term
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  setShowSearchResults(!showSearchResults);
                  setSearchQuery("");
                }}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Toggle ${darkMode ? "light" : "dark"} mode`}
            >
              {darkMode ? <BsSun /> : <BsMoon />}
            </button>

            {/* Login and Register Buttons */}
            {token ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="avatar avatar-placeholder"
                >
                  <div className="bg-neutral text-neutral-content w-12 rounded-full">
                    <span className="text-3xl">{username[0]}</span>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <a>{email}</a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("username");
                        localStorage.removeItem("email");
                        location.reload();
                      }}
                    >
                      logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaUserPlus className="mr-2" />
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearchResults && (
          <div className="md:hidden py-2 px-4">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search movies"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {searchQuery ? (
                  <button
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                ) : (
                  <FaSearch className="text-gray-500" />
                )}
              </div>
            </div>

            {/* Mobile Search Results */}
            {searchQuery && (
              <div className="mt-2 max-h-64 overflow-y-auto rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {isSearching ? (
                  <div className="p-4 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    {searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleNavigation(`/movie/${movie.id}`)}
                        className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-10 rounded overflow-hidden">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/50x75?text=No+Poster";
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium truncate">
                              {movie.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {movie.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <RiMovie2Line className="mx-auto text-2xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No results found
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl"
            >
              <div className="h-full overflow-y-auto py-4">
                <div className="px-4 mb-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close menu"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <nav className="px-2 space-y-1">
                  <button
                    onClick={() => handleNavigation("/")}
                    className="group flex items-center px-2 py-3 text-base font-medium rounded-md w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FaHome className="mr-4 text-lg" />
                    Home
                  </button>
                  <button
                    onClick={() => handleNavigation("/movies")}
                    className="group flex items-center px-2 py-3 text-base font-medium rounded-md w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FaFilm className="mr-4 text-lg" />
                    Movies
                  </button>
                  <button
                    onClick={() => handleNavigation("/tv-shows")}
                    className="group flex items-center px-2 py-3 text-base font-medium rounded-md w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FaTv className="mr-4 text-lg" />
                    TV Shows
                  </button>

                  <div className="pt-2">
                    <div className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Categories
                    </div>
                    <div className="mt-1">
                      {genres.slice(0, 8).map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() =>
                            handleNavigation(`/genre/${genre.name}/${genre.id}`)
                          }
                          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleNavigation("/login")}
                      className="group flex items-center px-2 py-3 text-base font-medium rounded-md w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaSignInAlt className="mr-4 text-lg" />
                      Login
                    </button>
                    <button
                      onClick={() => handleNavigation("/register")}
                      className="group flex items-center px-2 py-3 text-base font-medium rounded-md w-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaUserPlus className="mr-4 text-lg" />
                      Register
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
