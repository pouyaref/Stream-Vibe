import axios from "axios";
import { useState, useEffect } from "react";
import { BsCalendarDate, BsStars, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaImdb, FaTheaterMasks, FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoEarth } from "react-icons/io5";
import { GiPopcorn } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [page, setPage] = useState(1);
  const url = `https://moviesapi.ir/api/v1/movies?page=${page}`;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
    setFavorites(new Set(storedFavorites));
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setMovies(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem('movieFavorites', JSON.stringify(Array.from(newFavorites)));
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-6xl text-yellow-400"
        >
          <GiPopcorn />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🎥 Featured Movies Section */}
        <div className={`mb-12 p-6 rounded-3xl ${darkMode ? "bg-gray-800/40 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} shadow-2xl border ${darkMode ? "border-gray-700/50" : "border-gray-200"}`}>
          {/* 🏆 Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
            >
              Trending Movies
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2"
            >
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Page {page} of 25
              </span>
            </motion.div>
          </div>

          {/* 🎞️ Movie Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
            >
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.03, boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className={`relative flex flex-col rounded-2xl overflow-hidden shadow-xl ${darkMode ? "bg-gray-800/70" : "bg-white"} border ${darkMode ? "border-gray-700/50" : "border-gray-200"}`}
                >
                  {/* ❤️ Favorite Button */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(movie.id)}
                    className="absolute top-3 left-3 z-10 p-2 rounded-full backdrop-blur-sm bg-black/30 hover:bg-black/50 transition-colors"
                    aria-label={favorites.has(movie.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.has(movie.id) ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-white text-xl hover:text-red-400" />
                    )}
                  </motion.button>

                  {/* ⭐ Premium Badge */}
                  {movie.rated && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="absolute top-3 right-3 z-10"
                    >
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${darkMode ? "bg-emerald-600/30 text-emerald-300" : "bg-emerald-100 text-emerald-800"} shadow-md`}>
                        <BsStars /> {movie.rated}
                      </span>
                    </motion.div>
                  )}

                  {/* 🎬 Movie Poster */}
                  <div className="relative h-80 overflow-hidden group">
                    <motion.img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                      }}
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    
                    {/* Quick Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold mb-1 line-clamp-1 text-white">{movie.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-gray-300">
                          <BsCalendarDate /> {movie.year}
                        </span>
                        <span className="flex items-center gap-1 bg-yellow-600/90 px-2 py-1 rounded text-white">
                          <FaImdb /> {movie.imdb_rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 📝 Movie Details */}
                  <div className="flex flex-col flex-grow p-5">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold line-clamp-2 mb-3">{movie.title}</h3>

                      {/* 🎭 Genres */}
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <FaTheaterMasks className={`flex-shrink-0 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.map((genre, index) => (
                            <span key={index} className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                              {genre}
                              {index !== movie.genres.length - 1 ? "," : ""}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 🌍 Country */}
                      <div className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <IoEarth className="text-blue-400" />
                        <span>{movie.country}</span>
                      </div>
                    </div>

                    {/* ▶️ Watch Button (Always at the bottom) */}
                    <div className="mt-auto pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${darkMode ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900" : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white"} shadow-lg`}
                      >
                        <FaPlay /> Watch Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* 🔢 Pagination */}
          <div className="flex justify-center mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="join shadow-lg"
            >
              <button
                className={`join-item btn ${darkMode ? "bg-gray-700 hover:bg-gray-600 border-gray-600" : "bg-white hover:bg-gray-100 border-gray-200"} ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
              >
                <BsChevronLeft />
              </button>
              <button className={`join-item btn ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} cursor-default`}>
                Page {page}
              </button>
              <button
                className={`join-item btn ${darkMode ? "bg-gray-700 hover:bg-gray-600 border-gray-600" : "bg-white hover:bg-gray-100 border-gray-200"} ${page === 25 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setPage(page + 1)}
                disabled={page === 25}
              >
                <BsChevronRight />
              </button>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;