import "./App.css";
import { useContext, useEffect, useState } from "react";
import Card from "./components/Card";
import CreatePlaylist from "./components/CreatePlaylist";
import { initializePlaylist } from "./initialize";
import Navbar from "./components/Navbar";
import { MusicContext } from "./Context";
import TopResults from "./components/TopResults";
import RecentlyPlayed from "./components/RecentlyPlayed";
import GenreSongs from "./components/GenreSongs";

function App() {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState(null);

  const [topResults, setTopResults] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [genreTracks, setGenreTracks] = useState([]);
  const [genre1] = useState("Pop"); // Example genre
  const [genre2] = useState("Rock"); // Example genre
  const [genre3] = useState("Jazz"); // Example genre


  // State for "See More" and "See Less"
  const [showAllTopResults, setShowAllTopResults] = useState(false);
  const [showAllGenreTracks, setShowAllGenreTracks] = useState(false);
  const [showAllRecentlyPlayed, setShowAllRecentlyPlayed] = useState(false);

  const musicContext = useContext(MusicContext);
  const isLoading = musicContext.isLoading;
  const setIsLoading = musicContext.setIsLoading;
  const setLikedMusic = musicContext.setLikedMusic;
  const setPinnedMusic = musicContext.setPinnedMusic;
  const resultOffset = musicContext.resultOffset;
  const setResultOffset = musicContext.setResultOffset;

  const fetchMusicData = async () => {
    setTracks([]);
    window.scrollTo(0, 0);
    setIsLoading(true);
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
      // Filter out tracks with an empty preview URL
      setTracks(jsonData.tracks.items.filter(track => track.preview_url));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopResults = async () => {
    try {
      const response = await fetch(
        `https://v1.nocodeapi.com/mustafa_32/spotify/fEOqRIGccGKlfjjn/search?q=top&type=track&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch top results");
      }

      const jsonData = await response.json();
      console.log(jsonData)
      setTopResults(jsonData.tracks.items.filter(track => track.preview_url));
    } catch (error) {
      setMessage(error.message);
    }
  };

  // const fetchRecentlyPlayed = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://v1.nocodeapi.com/mustafa_32/spotify/fEOqRIGccGKlfjjn/player/recently-played`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch recently played songs");
  //     }

  //     const jsonData = await response.json();
  //     setRecentlyPlayed(jsonData.items.map((item) => item.track).filter(track => track.preview_url));
  //   } catch (error) {
  //     setMessage(error.message);
  //   }
  // };

  const fetchGenreTracks = async () => {
    try {
      const response1 = await fetch(
        `https://v1.nocodeapi.com/mustafa_32/spotify/fEOqRIGccGKlfjjn/search?q=${genre1}&type=track&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response1.ok) {
        throw new Error("Failed to fetch genre songs");
      }

      const jsonData1 = await response1.json();
      setGenreTracks(jsonData1.tracks.items.filter(track => track.preview_url));
    } catch (error) {
      setMessage(error.message);
    }
    try {
      const response2 = await fetch(
        `https://v1.nocodeapi.com/mustafa_32/spotify/fEOqRIGccGKlfjjn/search?q=${genre2}&type=track&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response2.ok) {
        throw new Error("Failed to fetch genre songs");
      }

      const jsonData2 = await response2.json();
      setGenreTracks(jsonData2.tracks.items.filter(track => track.preview_url));
    } catch (error) {
      setMessage(error.message);
    }
    try {
      const response = await fetch(
        `https://v1.nocodeapi.com/mustafa_32/spotify/fEOqRIGccGKlfjjn/search?q=${genre3}&type=track&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch genre songs");
      }

      const jsonData = await response.json();
      setGenreTracks(jsonData.tracks.items.filter(track => track.preview_url));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setResultOffset(0);
      fetchMusicData();
    }
  };

  useEffect(() => {
    initializePlaylist();

    const fetchToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=a77073181b7d48eb90003e3bb94ff88a&client_secret=68790982a0554d1a83427e061e371507",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const jsonData = await response.json();
        setToken(jsonData.access_token);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToken();
    setLikedMusic(JSON.parse(localStorage.getItem("likedMusic")));
    setPinnedMusic(JSON.parse(localStorage.getItem("pinnedMusic")));

    fetchTopResults();
    fetchGenreTracks();
  }, [setIsLoading, setLikedMusic, setPinnedMusic, genre1, genre2, genre3]);

  // Function to handle hiding the preview URL
  const renderPreviewUrl = (previewUrl) => {
    if (!previewUrl) return null;
    return <audio controls src={previewUrl} />;
  };

  return (
    <>
      <Navbar
        keyword={keyword}
        setKeyword={setKeyword}
        handleKeyPress={handleKeyPress}
        fetchMusicData={fetchMusicData}
      />

      <div className="container">
        <TopResults tracks={showAllTopResults ? topResults : topResults.slice(0, 4)} />
        <div className="text-center">
          {!showAllTopResults && topResults.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllTopResults(true)}>
              See More
            </button>
          )}
          {showAllTopResults && topResults.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllTopResults(false)}>
              See Less
            </button>
          )}
        </div>

        {/* <RecentlyPlayed tracks={showAllRecentlyPlayed ? recentlyPlayed : recentlyPlayed.slice(0, 4)} />
        <div className="text-center">
          {!showAllRecentlyPlayed && recentlyPlayed.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllRecentlyPlayed(true)}>
              See More
            </button>
          )}
          {showAllRecentlyPlayed && recentlyPlayed.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllRecentlyPlayed(false)}>
              See Less
            </button>
          )}
        </div> */}

        <GenreSongs genre={genre1} tracks={showAllGenreTracks ? genreTracks : genreTracks.slice(0, 4)} />
        <div className="text-center">
          {!showAllGenreTracks && genreTracks.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllGenreTracks(true)}>
              See More
            </button>
          )}
          {showAllGenreTracks && genreTracks.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllGenreTracks(false)}>
              See Less
            </button>
          )}
        </div>
        <GenreSongs genre={genre2} tracks={showAllGenreTracks ? genreTracks : genreTracks.slice(0, 4)} />
        <div className="text-center">
          {!showAllGenreTracks && genreTracks.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllGenreTracks(true)}>
              See More
            </button>
          )}
          {showAllGenreTracks && genreTracks.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllGenreTracks(false)}>
              See Less
            </button>
          )}
        </div>
        <GenreSongs genre={genre3} tracks={showAllGenreTracks ? genreTracks : genreTracks.slice(0, 4)} />
        <div className="text-center">
          {!showAllGenreTracks && genreTracks.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllGenreTracks(true)}>
              See More
            </button>
          )}
          {showAllGenreTracks && genreTracks.length > 4 && (
            <button className="btn btn-outline-success" onClick={() => setShowAllGenreTracks(false)}>
              See Less
            </button>
          )}
        </div>

        <div className={`row ${isLoading ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <div className="row">
          {tracks.length > 0 ? (
            tracks.map((element) => (
              <Card key={element.id} element={element} renderPreviewUrl={renderPreviewUrl} />
            ))
          ) : (
            <div className="col-12 py-5 text-center">
              <p>No tracks available</p>
            </div>
          )}
        </div>
        <div className="row" hidden={tracks.length === 0}>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous - 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
              disabled={resultOffset === 0}
            >
              Previous Page: {resultOffset / 20}
            </button>
          </div>
          <div className="col">
            <button
              onClick={() => {
                setResultOffset((previous) => previous + 20);
                fetchMusicData();
              }}
              className="btn btn-outline-success w-100"
            >
              Next Page: {resultOffset / 20 + 2}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h4 className="text-center text-danger py-2">{message}</h4>
          </div>
        </div>
      </div>
      <div
        className="modal fade position-absolute"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <CreatePlaylist />
      </div>
    </>
  );
}

export default App;
