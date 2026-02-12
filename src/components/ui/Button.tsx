"use client";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#0d6efd",
        color: "#fff",
        padding: "8px 16px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}