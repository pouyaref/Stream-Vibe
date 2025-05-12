import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = `https://moviesapi.ir/api/v1/movies/${id}`;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(url);
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, url]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center mt-8">No movie data found</div>;
  }

  return (
    <>
      {" "}
      <Header />{" "}
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Movie Header */}
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <figure className="lg:w-1/3">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body lg:w-2/3">
              <h1 className="card-title text-4xl font-bold">
                {movie.title}{" "}
                <span className="text-2xl font-normal">({movie.year})</span>
              </h1>

              <div className="flex flex-wrap gap-2 my-2">
                {movie.genres.map((genre, index) => (
                  <span key={index} className="badge badge-primary">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    IMDb Rating
                  </h3>
                  <p className="text-2xl font-bold">
                    {movie.imdb_rating}{" "}
                    <span className="text-sm font-normal">/ 10</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Runtime
                  </h3>
                  <p className="text-xl">{movie.runtime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Rated</h3>
                  <p className="text-xl">{movie.rated}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Released
                  </h3>
                  <p className="text-xl">{movie.released}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Metascore
                  </h3>
                  <p className="text-xl">{movie.metascore}</p>
                </div>
              </div>

              <div className="divider"></div>

              <div>
                <h2 className="text-xl font-bold mb-2">Plot</h2>
                <p className="text-lg">{movie.plot}</p>
              </div>

              <div className="divider"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold mb-2">Director</h3>
                  <p>{movie.director}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Writer</h3>
                  <p>{movie.writer}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Actors</h3>
                  <p>{movie.actors}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Country</h3>
                  <p>{movie.country}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Awards</h3>
                  <p>{movie.awards}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Movie Screenshots */}
          {movie.images && movie.images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movie.images.map((image, index) => (
                  <div key={index} className="card bg-base-100 shadow-xl">
                    <figure>
                      <img
                        src={image}
                        alt={`${movie.title} screenshot ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MovieDetail;
