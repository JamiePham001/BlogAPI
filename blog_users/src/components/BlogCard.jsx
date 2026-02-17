import style from "../styles/blogCard.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export const BlogCard = ({ postData }) => {
  const date = new Date(postData.createdAt);
  const readableDate = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      </div>
    </>
  );
};
