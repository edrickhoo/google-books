import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import styles from "./NavBar.module.scss";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";

const NavBar = () => {
  const favourites = useAppSelector(
    (state: RootState) => state.favourites.value
  );
  const reviews = useAppSelector((state: RootState) => state.reviews.value);
  return (
    <nav className={styles.NavContainer}>
      <div className={styles.Wrapper}>
        <Link className={styles.Links} to={`/`}>
          Home
        </Link>
        <Link className={styles.Links} to={`/favourites`}>
          Favourites
          <BsBookmarkHeart size={16} />({favourites.length || 0})
        </Link>
        <Link className={styles.Links} to={`/reviews`}>
          Reviews <MdRateReview size={16} />({reviews.length || 0})
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
