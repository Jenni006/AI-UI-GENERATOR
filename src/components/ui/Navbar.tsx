"use client";

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#111827",
        color: "white",
        marginBottom: "16px",
      }}
    >
      {title || "Navbar"}
    </div>
  );
}
