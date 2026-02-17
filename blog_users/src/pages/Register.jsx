import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { jwtDecode } from "jwt-decode";

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/register", {
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
        navigate("/");
      } else {
        const error = await response.json();
        setErrorMessage(error.errors || [{ msg: "Registration failed" }]);
      }
    } catch (error) {
      console.error("Registration error: ", error);
      alert("An error occurred during registration");
    }
  };

  return (
    <div>
      <h1>Create an account:</h1>
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
        <button type="submit">Register</button>
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
