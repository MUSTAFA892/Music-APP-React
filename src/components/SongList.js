import React from 'react';
import Card from './Card';

const SongList = ({ title, tracks, showAll, setShowAll }) => {
  return (
    <div className="song-list">
      <h2>{title}</h2>
      <div className="list-container">
        {tracks.map((track) => (
          <Card key={track.id} element={track} />
        ))}
      </div>
      {tracks.length > 4 && !showAll && (
        <div className="text-center">
          <button className="btn btn-outline-success" onClick={() => setShowAll(true)}>
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default SongList;
