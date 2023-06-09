import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";
import Root from "./routes/root/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import Home from "./routes/root/Home";
import FavouritesPage from "./routes/favourites/FavouritesPage";
import SingleReview from "./routes/reviews/id/SingleReview";
import NavBar from "./components/NavBar/NavBar";
import ReviewsPage from "./routes/reviews/ReviewsPage";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "favourites",
    element: <FavouritesPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "review/:id",
    element: <SingleReview />,
    errorElement: <ErrorPage />,
  },
  {
    path: "reviews",
    element: <ReviewsPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
