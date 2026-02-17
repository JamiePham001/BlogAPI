import { useAuth } from "../AuthContext.jsx";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditPost = () => {
  const { token } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [content, setContent] = useState("");
  const [publish, setPublish] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
          const data = await response.json();
          const post = data.post;
          setTitle(post.title);
          setIntroduction(post.introduction);
          setContent(post.content);
          setPublish(post.published);
        } else {
          const error = await response.json();
          setErrorMessage(error.message || "Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        setErrorMessage("An error occurred while fetching the post.");
      }
    };
    fetchData();
  }, [postId, token]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/update/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            introduction,
            content,
            published: publish,
          }),
        },
      );

      if (response.ok) {
        alert("Post updated successfully!");
        navigate("/");
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setErrorMessage("An error occurred while updating the post.");
    }
  };
  return (
    <div>
      <h1>Edit Post</h1>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          spellCheck="true"
          style={{ height: "2rem", width: "400px" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Introduction"
          rows={15}
          cols={60}
          spellCheck="true"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />

        <textarea
          placeholder="Content"
          rows={50}
          cols={60}
          spellCheck="true"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <input
            type="checkbox"
            name="publish"
            id="publish"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          <label htmlFor="publish">Publish post?</label>
        </div>

        <button type="submit" style={{ justifySelf: "flex-end" }}>
          Submit
        </button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};
