import React from "react";
import Card from "./Card";

const GenreSongs = ({ genre, tracks }) => {
  return (
    <div className="row">

      <h2
  className="text-center my-4"
  style={{
    fontFamily: "'Press Start 2P', cursive", // Funky font
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #FF007F, #FFCC00, #66FF66, #00CFFF, #FF00FF)', // Aurora gradient
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    padding: '10px 15px', // Adjust the padding to fit the text length
    display: 'inline-block', // Ensures the border adjusts to the text width
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
  }}
>
  {genre}
</h2>
      {tracks.map((element) => (
        <Card key={element.id} element={element} />
      ))}
    </div>
  );
};

export default GenreSongs;
