import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchSingleBookById,
  organisedBooksData,
} from "../../../api/google-books-api";
import { useAppDispatch } from "../../../hooks";
import { toggle } from "../../../redux/favourites";
import { RootState } from "../../../store";
import styles from "./SingleReview.module.scss";
import { save } from "../../../redux/reviews";
import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";

export interface FormType {
  id: string;
  text: string;
  rating: number | null;
  book?: organisedBooksData;
}

const SingleReview = () => {
  const { id } = useParams();
  const [formObj, setFormObj] = useState<FormType>({
    id: "",
    text: "",
    rating: null,
  });
  const { data, isLoading, error } = useQuery(
    ["singleReview"],
    () => fetchSingleBookById(id),
    {
      onSuccess(data) {
        setFormObj({ ...formObj, id: data.id, book: data });
      },
    }
  );

  const reviews = useSelector((state: RootState) => state.reviews.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let foundBook = reviews.find((item) => item.id === id);
    foundBook && setFormObj(foundBook);
  }, []);

  useEffect(() => {
    console.log(reviews);
    console.log(formObj);
  }, [reviews]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No book was found</div>;
  }

  const { title, subtitle, authors, image, description } = data;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(save(formObj));
  };

  return (
    <div className={styles.PageContainer}>
      <NavBar />
      <main className={styles.MainContainer}>
        <div className={styles.Card}>
          <span className={styles.Title}>{title}</span>
          <span className={styles.Subtitle}>{subtitle}</span>
          <span>{Array.isArray(authors) ? authors.join(", ") : authors}</span>
          <div className={styles.ImageDescriptionContainer}>
            <div>
              <img className={styles.Image} src={image} alt="" />
            </div>
            <div>
              <p
                dangerouslySetInnerHTML={{ __html: description }}
                className={styles.Description}
              ></p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.Form}>
          <span className={styles.ReviewTitle}>Write your review</span>
          <div>
            <span>Select Rating - </span>
            <select
              className={styles.FormRatingInput}
              value={formObj.rating ? formObj.rating : ""}
              name="rating"
              onChange={(e) =>
                setFormObj({ ...formObj, rating: Number(e.target.value) })
              }
            >
              <option hidden>Select Rating</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <textarea
            className={styles.FormTextInput}
            value={formObj.text}
            onChange={(e) => setFormObj({ ...formObj, text: e.target.value })}
            name="text"
            cols={30}
            rows={10}
            placeholder="Write your thoughts about the book"
          ></textarea>
          <button className={styles.SaveBtn}>Save</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SingleReview;
