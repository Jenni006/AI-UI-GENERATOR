"use client";

interface CardProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "#111", // dark background
        color: "#fff",            // text white
        border: "1px solid #333",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "16px",
        width: "300px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
      }}
    >
      {title && <h3>{title}</h3>}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {children}
      </div>
    </div>
  );
}
