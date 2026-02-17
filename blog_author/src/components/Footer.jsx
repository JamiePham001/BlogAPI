export const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "#f0f0f0",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>&copy; {new Date().getFullYear()} KeyGen. All rights reserved.</p>
    </footer>
  );
};
