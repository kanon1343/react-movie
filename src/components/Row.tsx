import axios from "../axios";
import { useEffect, useState } from "react";
import { API_KEY } from "../request"
import "./Row.scss";

const base_url = "https://image.tmdb.org/t/p/original";

type Props = {
    title: string;
    fetchUrl: string;
    isLargeRow?: boolean; // サイズ変更.
};

type Movie = {
    id: string; 
    name: string;
    title: string;
    original_name: string;
    poster_path: string;
    backdrop_path: string;
};

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [trailerUrl, setTrailerUrl] = useState<string | null>("");

    // URLが更新されるたびにデータも取得.
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            console.log(request.data.results);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const handleClick = async(movie: Movie) => {
        if(trailerUrl) {
            setTrailerUrl("");
        } else {
            const trailerUrl = await axios.get(`/movie/${movie.id}/videos?api_key=${API_KEY}`);
            setTrailerUrl(trailerUrl.data.results[0]?.key);
        }
    };

    return (
        <div className="Row">
            <h2>{ title }</h2>
            <div className="Row-posters">
                {movies.map((movie, i) => (
                    <img
                        key={movie.id}
                        className={`Row-poster ${isLargeRow && "Row-poster-large"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path: movie.backdrop_path}`}
                        alt={movie.name}
                        onClick={() => handleClick(movie)}
                    />
                ))}
            </div>
        </div>
    )
}