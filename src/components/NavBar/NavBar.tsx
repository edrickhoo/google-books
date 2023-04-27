import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div>
      <Link to={`/`}>Home</Link>
      <Link to={`/favourites`}>Favourites</Link>
      <Link to={`/reviews`}>Reviews</Link>
    </div>
  );
};

export default NavBar;
