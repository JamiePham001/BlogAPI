import App from "./App.jsx";
import { Home } from "./pages/Home.jsx";
import { Register } from "./pages/Register.jsx";
import { Login } from "./pages/Login.jsx";
import { Error } from "./pages/Error.jsx";
import { Post } from "./pages/Post.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "post/:postId",
        element: <Post />,
      },
    ],
  },
];

export default routes;
