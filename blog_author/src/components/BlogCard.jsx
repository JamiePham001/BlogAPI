import style from "../styles/blogCard.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export const BlogCard = ({ postData, onRefresh }) => {
  const { token } = useAuth();
  const date = new Date(postData.createdAt);
  const readableDate = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const unpblishedbtn = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/unpublish/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        alert("Post unpublished successfully");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error unpublishing post:", error);
      alert("An error occurred while unpublishing the post.");
    }
  };

  const publishedbtn = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/publish/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        alert("Post published successfully");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("An error occurred while publishing the post.");
    }
  };

  const deleteBtn = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        alert("Post deleted successfully");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Link
          style={{
            width: "500px",
            maxHeight: "350px",
            backgroundColor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            padding: "2rem",
            overflow: "hidden",
          }}
          to={`/post/${postData.id}`}
          className={style.cardContainer}
        >
          <div
            className="author"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>by {postData.author.username}</div>
            <div>{readableDate}</div>
          </div>
          <div className="post-content">
            <h2 className={style.title}>{postData.title}</h2>
            <p className={style.content}>{postData.introduction}</p>
          </div>
          <hr style={{ width: "100%" }} />
          <div className="post-stats">{postData.comments.length} comments</div>
        </Link>
        <div
          style={{
            width: "500px",
            height: "30px",
            backgroundColor: "#939C81",
            padding: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete this post? This action cannot be undone.",
                )
              ) {
                deleteBtn(postData.id);
              }
            }}
            className={style.link}
          >
            Delete
          </a>
          <Link to={`/edit/${postData.id}`} className={style.link}>
            Edit
          </Link>
          {postData.published ? (
            <a
              onClick={() => unpblishedbtn(postData.id)}
              className={style.link}
            >
              Unpublish
            </a>
          ) : (
            <a onClick={() => publishedbtn(postData.id)} className={style.link}>
              Publish
            </a>
          )}
        </div>
      </div>
    </>
  );
};
