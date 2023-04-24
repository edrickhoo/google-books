import { configureStore } from "@reduxjs/toolkit";
import faviouritesReducer from "./redux/favourites";

export const store = configureStore({
  reducer: {
    favourites: faviouritesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
