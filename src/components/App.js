import React, {useState, useEffect} from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movies';
import Search from './Search';

const API_KEY = "hogehoge";
const MOVIE_API_URL = `https://www.omdbapi.com/?s=man&apikey=${API_KEY}`; // ここにOMDBAPIのデフォルトのエンドポイントを入れておく


function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.Response === "True") {
            setMovies(jsonResponse.Search);
            setLoading(false);
          } else {
            setErrorMessage(jsonResponse.Error);
            setLoading(false);
          }
        });
  }, []);

  const search = searchValue => {
    setLoading(true);
    setErrorMessage(null);

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.Response === "True") {
            setMovies(jsonResponse.Search);
            setLoading(false);
          } else {
            setErrorMessage(jsonResponse.Error);
            setLoading(false);
          }
        });
  };

  return (
      <div className="App">
        <Header text="MOVIE SEARCH"/>
        <Search search={search}/>
        <p className="App-intro">お気に入りの映画を共有する</p>
        <div className="movies">
          {loading && !errorMessage ? (
              <span>Loading...</span>
          ) : errorMessage ? (
              <div className="errorMessage">{errorMessage}</div>
          ) : (
              movies.map((movie, index) => (
                <Movie key={`${index}-${movie.Title}`} movie={movie} />
              )
          ))}
        </div>
      </div>
  )
}

export default App;
