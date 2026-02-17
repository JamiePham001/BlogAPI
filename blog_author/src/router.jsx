import App from "./App.jsx";
import { Home } from "./pages/Home.jsx";
import { Error } from "./pages/Error.jsx";
import { CreatePost } from "./pages/CreatePost.jsx";
import { Post } from "./pages/Post.jsx";
import { UnpublishedPosts } from "./pages/UnpublishedPosts.jsx";
import { EditPost } from "./pages/EditPost.jsx";

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
        path: "create/post",
        element: <CreatePost />,
      },
      {
        path: "post/:postId",
        element: <Post />,
      },
      {
        path: "post/unpublished",
        element: <UnpublishedPosts />,
      },
      {
        path: "edit/:postId",
        element: <EditPost />,
      },
    ],
  },
];

export default routes;
