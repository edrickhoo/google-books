import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { organisedBooksData } from "../api/google-books-api";

interface FavouritesState {
  value: organisedBooksData[];
}

const favs = localStorage.getItem("favourites");

const initialState: FavouritesState = {
  value: (favs && JSON.parse(favs)) || [],
};

export const faviouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    toggle: (state, action: PayloadAction<organisedBooksData>) => {
      let filtered = state.value.filter(
        (item) => item.id !== action.payload.id
      );
      if (filtered.length !== state.value.length) {
        state.value = filtered;
      } else {
        state.value = [...state.value, action.payload];
      }

      localStorage.setItem("favourites", JSON.stringify(state.value));
    },

    set: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle, set } = faviouritesSlice.actions;

export default faviouritesSlice.reducer;
