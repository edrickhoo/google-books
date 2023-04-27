import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormType } from "../routes/reviews/id/SingleReview";

interface FavouritesState {
  value: FormType[];
}

const reviews = localStorage.getItem("reviews");

const initialState: FavouritesState = {
  value: (reviews && JSON.parse(reviews)) || [],
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<FormType>) => {
      let filtered = state.value.filter(
        (item) => item.id !== action.payload.id
      );
      if (state.value.length > 0 && filtered.length !== state.value.length) {
        state.value = [...filtered, action.payload];
      } else {
        state.value = [...state.value, action.payload];
      }
      localStorage.setItem("reviews", JSON.stringify(state.value));
    },

    set: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { save, set } = reviewsSlice.actions;

export default reviewsSlice.reducer;
