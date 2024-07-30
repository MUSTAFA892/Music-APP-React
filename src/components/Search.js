import React, { useState, useContext } from "react";
import { MusicContext } from "../Context";
import Card from "./Card";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const musicContext = useContext(MusicContext);
  const token = musicContext.token; // Assuming token is available in context
  const resultOffset = musicContext.resultOffset;
  const setResultOffset = musicContext.setResultOffset;

  const fetchMusicData = async () => {
    setIsLoading(true);
    setTracks([]);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${keyword}&type=track&offset=${resultOffset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch music data");
      }

      const jsonData = await response.json();
      setTracks(jsonData.tracks.items.filter(track => track.preview_url));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchMusicData();
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Search Songs</h1>
      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onKeyDown={handleKeyPress}
        className="form-control me-2 w-75"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button
        onClick={fetchMusicData}
        className="btn btn-outline-success"
      >
        Search
      </button>

      <div className="row">
        {isLoading ? (
          <div className="col-12 py-5 text-center">
            <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {tracks.length > 0 ? (
              tracks.map((element) => (
                <Card key={element.id} element={element} />
              ))
            ) : (
              <div className="col-12 py-5 text-center">
                <p>No tracks available</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
