import { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Header } from "./components/header.jsx";
import { useAuth } from "./AuthContext.jsx";
import { Footer } from "./components/footer.jsx";

// Include credentials with every request
// const response = await fetch("http://localhost:3000/api/posts", {
//   credentials: "include", // Sends cookies automatically
// });

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;

    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "http://localhost:5173/login";
    } else if (user.username !== "author") {
      // Check if user is authorized to access author page
      throw new Response("Forbidden", {
        status: 403,
        statusText: "Access denied: Author privileges required",
      });
    }
  }, [user, loading]);

  return (
    <div className="page-wrapper">
      <Header></Header>
      <main className="main-content">
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
