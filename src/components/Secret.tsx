import React from "react";

const Secret: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
      }}
    >
      <iframe
        src="/ocarina.html"
        style={{ width: "800px", height: "600px", border: "none" }}
        title="Ocarina"
      />
    </div>
  );
};

export default Secret;