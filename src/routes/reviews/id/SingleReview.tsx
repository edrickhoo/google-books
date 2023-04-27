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

  if (!data) {
    return <div>No book was found</div>;
  }

  const { title, subtitle, authors, image, description } = data;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(save(formObj));
  };

  return (
    <div>
      <NavBar />
      <div>
        <div>
          <div className={styles.Card}>
            <span className={styles.Title}>{title}</span>
            <button
              onClick={() => {
                dispatch(toggle(data));
              }}
            >
              ^-^
            </button>
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
          <form onSubmit={handleSubmit}>
            <span>Write your review</span>
            <select
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
            <textarea
              value={formObj.text}
              onChange={(e) => setFormObj({ ...formObj, text: e.target.value })}
              name="text"
              cols={30}
              rows={10}
              placeholder="Write your thoughts about the book"
            ></textarea>

            <button>Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingleReview;
