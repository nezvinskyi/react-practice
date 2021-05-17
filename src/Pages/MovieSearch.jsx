import { useCallback, useEffect, useState, useRef } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { searchMovies } from '../utils/movieApi';
import _ from 'lodash';


const MovieSearch = () => {
	const location = useLocation();
	const { pathname, search } = location;
	const initialQueryState = queryString.parse(search);

	const { push } = useHistory()
	const [query, setQuery] = useState(initialQueryState.query || '');
	const [movieList, setMovieList] = useState([]);
	const inputRef = useRef()

	useEffect(() => {
		inputRef.current.focus()
	})

	const handleChange = (event) => {
		setQuery(event.target.value)
		push({
			...location,
			search: `?query=${event.target.value}`
		})
	};

  const movieSearch = useCallback(
    _.debounce(
      (query) =>
        searchMovies(query).then(({ results }) => setMovieList(results)),
      300,
    ),
    [],
  );

	useEffect(() => {
		if (!query) return
		
		movieSearch(query)
	}, [query, movieSearch])

	return (<div className="movie-search">
		<input type="text" ref={inputRef} value={query} onChange={handleChange} />
		<ul>
			{movieList.map(({id, original_title}) =>
				<li key={id}>
					<Link to={{
						pathname: `${pathname}/${id}`,
						state: { query}
					}}>{original_title}</Link>
				</li>
			)}
		</ul>

	</div> ) 
}
 
export default MovieSearch;