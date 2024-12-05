import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>AI Academic Assistant</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/study-buddy" style={styles.link}>Study Buddy</Link></li>
        <li><Link to="/career-advisor" style={styles.link}>Career Advisor</Link></li>
        <li><Link to="/research-reviewer" style={styles.link}>Research Reviewer</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#4CAF50",
    color: "white",
  },
  logo: { margin: 0 },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
  },
};

export default Navbar;
