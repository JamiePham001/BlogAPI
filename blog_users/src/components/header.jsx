import style from "../styles/header.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100vw",
        height: "100px",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        className="header-container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 5fr 1fr",
          padding: "0 5rem",
          width: "100%",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <Link
          to="/"
          className={style.link}
          style={{
            textDecoration: "none",
            color: "#333",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          KeyGen
        </Link>
        <div className="header-btns" style={{ display: "flex", gap: "2rem" }}>
          <Link to="/about" className={style.link}>
            About
          </Link>
          <Link to="/collection" className={style.link}>
            Collection
          </Link>
          <Link to="/contact" className={style.link}>
            Contact
          </Link>
        </div>
        <div className="log-sign" style={{ display: "flex", gap: "2rem" }}>
          {user ? (
            <Link to="" className={style.link} onClick={logout}>
              Logout
            </Link>
          ) : (
            <>
              <Link to="/login" className={style.link}>
                Log In
              </Link>
              <Link to="/register" className={style.link}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
