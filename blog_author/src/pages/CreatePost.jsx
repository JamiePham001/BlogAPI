import { useAuth } from "../AuthContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
  const { token, username } = useAuth();
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [content, setContent] = useState("");
  const [publish, setPublish] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          title,
          introduction,
          content,
          published: publish,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setTitle("");
        setIntroduction("");
        setContent("");
        setPublish(true);
        navigate("/");
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("An error occurred while creating the post.");
    }
  };
  return (
    <div>
      <h1>Create Post</h1>
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
