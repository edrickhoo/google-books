import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import styles from "./NavBar.module.scss";

const NavBar = () => {
  const favourites = useAppSelector(
    (state: RootState) => state.favourites.value
  );
  const reviews = useAppSelector((state: RootState) => state.reviews.value);
  return (
    <div className={styles.NavContainer}>
      <Link className={styles.Links} to={`/`}>
        Home
      </Link>
      <Link className={styles.Links} to={`/favourites`}>
        Favourites({favourites.length || 0})
      </Link>
      <Link className={styles.Links} to={`/reviews`}>
        Reviews({reviews.length || 0})
      </Link>
    </div>
  );
};

export default NavBar;
