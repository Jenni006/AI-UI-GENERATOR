"use client";

interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
}

export default function Button({ label, children }: ButtonProps) {
  return (
    <button
      style={{
        padding: "10px 16px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      {label || children}
    </button>
  );
}
