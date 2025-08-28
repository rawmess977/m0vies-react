import { useState, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
import MovieCard from './components/MovieCard';

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

  // useEffect(() => {
  //   // run only when component full load
  // }, []);

  const fetchMovies = async () => {
    
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endPoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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

      setMoviesList(data.results || [])

   
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error in Fetching Movies. Please try again later`);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" className="Hero Banner" alt="" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
             <Spinner /> 
          ): eroorMessage ? (<p className="text-red-500">{eroorMessage}</p>) :(
            <ul>
              {
                moviesList.map((movie)=>(
                  // <p className="text-white" key={movie.id}>{movie.title}</p>
                  <MovieCard key={movie.id} movie={movie}/>
                ))
                
              }
              {
                console.log(moviesList)
              }
            </ul>
          ) }
        
        </section>
      </div>
    </main>
  );
}

export default App;
