import React, {useReducer, useEffect} from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movies';
import Search from './Search';

const API_KEY = "hogehoge";
const MOVIE_API_URL = `https://www.omdbapi.com/?s=man&apikey=${API_KEY}`; // ここにOMDBAPIのデフォルトのエンドポイントを入れておく

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducers = (state, action) => {
  switch (action.type) {
    case 'SEARCH_MOVIES_REQUEST':
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case 'SEARCH_MOVIES_SUCCESS':
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case 'SEARCH_MOVIES_FAILURE':
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state
  }
};


function App() {
  const [state, dispatch] = useReducer(reducers, initialState);

  useEffect(() => {
    fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.Response === "True") {
            dispatch({
              type: "SEARCH_MOVIES_SUCCESS",
              payload: jsonResponse.Search
            });
          } else {
            dispatch({
              type: "SEARCH_MOVIES_FAILURE",
              error: jsonResponse.Error
            });
          }
        });
  }, []);

  const search = searchValue => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST"
    });

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.Response === "True") {
            dispatch({
              type: "SEARCH_MOVIES_SUCCESS",
              payload: jsonResponse.Search
            });
          } else {
            dispatch({
              type: "SEARCH_MOVIES_FAILURE",
              error: jsonResponse.Error
            });
          }
        });
  };

  const { movies, errorMessage, loading } = state;

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
