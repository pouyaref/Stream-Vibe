import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MovieDetail from "./pages/MovieDetail";
import Genres from "./pages/Genres";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/movie/:id",
    element: <MovieDetail />,
  },
  {
    path: "/genre/:name/:id",
    element: <Genres />,
  },
    {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  
]);
