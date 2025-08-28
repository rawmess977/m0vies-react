import { useState, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appWrite";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
function App() {
  // const [count, setCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("");
  const [eroorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMoviesList, setTrendingMoviesList] = useState([])

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);


  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc}`;

      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error in Fetching Movies. Please try again later`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMoviesList(movies)
    } catch (error) {
      console.error(`Error fetching trending Movies:${error} `);
      setErrorMessage("Error Fetching trending movies");
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main>
      {/* <div className="pattern" /> */}
      <div className="wrapper">
        <header>
          <img src="/hero.png" className="Hero Banner" alt="" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {
           trendingMoviesList.length > 0 && searchTerm === '' && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {
                  
                  trendingMoviesList.map((movie,index)=>(
                    <li key={movie.$id}>
                      <p>{index+1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                      {console.log(movie.poster_url)}
                    </li>
                  ))
                }
              </ul>
              {console.log(trendingMoviesList)}
            </section>
           ) 
        }

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : eroorMessage ? (
            <p className="text-red-500">{eroorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                // <p className="text-white" key={movie.id}>{movie.title}</p>
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
