import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MovieDetail from "./pages/MovieDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/movie/:id",
    element: <MovieDetail />,
  },
]);
