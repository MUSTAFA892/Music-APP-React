import React from "react";
import Card from "./Card";

const RecentlyPlayed = ({ tracks }) => {
  return (
    <div className="row">
      <h2 className="text-center my-4">Recently Played</h2>
      {tracks.map((element) => (
        <Card key={element.id} element={element} />
      ))}
    </div>
  );
};

export default RecentlyPlayed;
