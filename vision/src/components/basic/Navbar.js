import React from "react";
import { useAuth } from "../../context/AuthProvider";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: "bold",
          letterSpacing: 3,
          transform: "scaleY(0.9)",
        }}
      >
        VISION
      </div>
    </nav>
  );
};

export default Navbar;
