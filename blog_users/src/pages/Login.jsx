import { redirect, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { jwtDecode } from "jwt-decode";

export const Login = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const userData = jwtDecode(data.token);
        login(token, userData);
        if (userData.username === "author") {
          // Pass token to author frontend via URL
          // due to local storage being origin-specific, the token is parsed into the URL to be used on the author server
          window.location.href = `http://localhost:5174?token=${token}`;
          logout();
        } else {
          navigate("/");
        }
      } else {
        const error = await response.json();
        setErrorMessage(error.errors || [{ msg: "Login failed" }]);
      }
    } catch (error) {
      console.error("Login erro: ", error);
      alert("An error occurred during login");
    }
  };

  return (
    <div>
      <h1>Login to your account:</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Log In</button>
      </form>
      {errorMessage.length > 0 && (
        <div>
          <ul>
            {errorMessage.map((error, index) => (
              <li key={index} style={{ color: "red" }}>
                {error.msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
