"use client";

interface InputProps {
  placeholder?: string;
}

export default function Input({ placeholder }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      style={{
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
      }}
    />
  );
}
