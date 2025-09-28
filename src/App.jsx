
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './components/MovieCard';

const OMDB_API_KEY = 'f48dd962';

function App() {
  const [query, setQuery] = useState('Batman');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const searchMovies = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setMessage('Please enter a movie name.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.get('https://www.omdbapi.com/', {
        params: {
          apikey: OMDB_API_KEY,
          s: searchQuery,
          type: 'movie',
        },
      });
      if (res.data.Response === 'True') {
        setMovies(res.data.Search);
        setMessage('');
      } else {
        setMovies([]);
        setMessage(res.data.Error || 'No movies found');
      }
    } catch (err) {
      setMovies([]);
      setMessage('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMovies('Batman');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-blue-100 px-4 py-8 md:px-8 lg:px-16">
      <h1 className="text-center mb-8 text-3xl font-bold">🎬 MovieMate</h1>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 w-full max-w-2xl mx-auto">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchMovies()}
          placeholder="Search movies..."
          className="px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-blue-100 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => searchMovies()}
          className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 w-full sm:w-auto"
        >
          Search
        </button>
      </div>
      {loading && <div className="text-center text-blue-300 mb-4">Searching...</div>}
      {message && !loading && <div className="text-center text-blue-300 mb-4">{message}</div>}
      {movies.length > 0 && !loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {movies.map((movie, i) => (
            <MovieCard key={i} movie={movie} />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="bg-slate-800 text-blue-100 p-6 rounded-xl shadow-lg text-center max-w-md mx-auto">
            {message ? message : 'No movies found'}
          </div>
        )
      )}
    </div>
  );
}

export default App;
