import style from "../styles/post.module.css";
import { useAuth } from "../AuthContext.jsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export const Post = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");
  const [refresh, setRefresh] = useState(0);

  const { postId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/posts/get/" + postId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const result = await response.json();
          setData(result.post);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("An error occurred while fetching the post.");
      }
    };

    if (user && token && postId) {
      fetchData();
    }
  }, [user, token, postId, refresh]);

  const submitComment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/comments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postId: postId,
            content: comment,
          }),
        },
      );
      if (response.ok) {
        setComment("");
        setRefresh((r) => r + 1);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("An error occurred while submitting the comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/delete/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deleting comment:", error);
      } else {
        setRefresh((r) => r + 1);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className={style.pageContainer}>
      <div className="authorDate" style={{ display: "flex", gap: "1rem" }}>
        <div className="name">{data?.author.username}</div>
        <div className="date">
          {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : ""}
        </div>
      </div>
      <h1 className="title">{data?.title}</h1>
      <div className="introduction">{data?.introduction}</div>
      <br />
      <div className="content" style={{ paddingBottom: "3rem" }}>
        {data?.content}
      </div>
      <hr style={{ width: "100%" }} />
      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={submitComment}>
          <textarea
            name="comment"
            id="comment"
            rows="5"
            placeholder="Write a comment..."
            style={{ width: "100%" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button type="submit">Submit Comment</button>
        </form>
        <br />
        <div
          className="comments-container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          {data?.comments && data.comments.length > 0 ? (
            data.comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#f0f0f0",
                  padding: "1rem",
                  borderRadius: "5px",
                }}
              >
                <div
                  className="comment"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="comment-author">{comment.username}</div>
                    <div className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="comment-content">{comment.content}</div>
                </div>
                {user &&
                  (user.username === comment.username || user.isAuthor) && (
                    <a
                      onClick={() => handleDeleteComment(comment.id)}
                      className={style.link}
                    >
                      Delete
                    </a>
                  )}
              </div>
            ))
          ) : (
            <div>No comments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
