"use client";

interface ModalProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Modal({ title, children }: ModalProps) {
  return (
    <div
      style={{
        border: "1px solid #aaa",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        marginTop: "16px",
      }}
    >
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
