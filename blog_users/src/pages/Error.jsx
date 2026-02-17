import { useRouteError } from "react-router-dom";

export const Error = () => {
  const error = useRouteError();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Oops! Something went wrong</h1>
      <p style={{ fontSize: "1.2rem", color: "#666" }}>
        {error?.status === 404
          ? "404: Page Not Found"
          : error?.statusText ||
            error?.message ||
            "An unexpected error occurred"}
      </p>
      {error?.data && <p style={{ color: "#999" }}>{error.data}</p>}
      <a href="/" style={{ color: "#007bff", textDecoration: "underline" }}>
        Go back home
      </a>
    </div>
  );
};
