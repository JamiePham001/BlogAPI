import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Header } from "./components/header.jsx";
import { useAuth } from "./AuthContext.jsx";
import { Footer } from "./components/Footer.jsx";

function App() {
  const { user, token } = useAuth();

  useEffect(() => {
    if (user?.isAuthor) {
      window.location.href = `http://localhost:5174?token=${token}`;
    }
  }, [user, token]);

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
