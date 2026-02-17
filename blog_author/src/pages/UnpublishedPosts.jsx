import { useAuth } from "../AuthContext.jsx";
import { Link } from "react-router-dom";
import style from "../styles/home.module.css";
import { BlogCard } from "../components/BlogCard.jsx";
import { useEffect, useState } from "react";

export const UnpublishedPosts = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/posts/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filteredPosts = data.posts.filter((post) => !post.published);
          setData(filteredPosts);
        } else {
          const error = await response.json();
          alert(error.message || "Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert("An error occurred while fetching posts.");
      }
    };

    fetchData();
  }, [token, refresh]);

  console.log(data);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 5fr 1fr",
        width: "var(--page-width)",
        margin: "0 auto",
        paddingTop: "2rem",
      }}
    >
      <div></div>
      <section
        className="main-content"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {data ? (
          data.map((post) => {
            return (
              <BlogCard
                key={post.id}
                user={user}
                postData={post}
                onRefresh={() => setRefresh((r) => r + 1)}
              ></BlogCard>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
        {!data || data.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p>No unpublished posts available.</p>
          </div>
        ) : null}
      </section>
      <div>
        <Link to="/create/post" className={style.newPost}>
          New post
        </Link>
      </div>
    </div>
  );
};
