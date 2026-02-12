"use client";

interface ModalProps {
  children?: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  return (
    <div
      style={{
        backgroundColor: "#2a2a2a", 
        border: "1px solid #444",
        padding: "16px",
        borderRadius: "8px",
        width: "300px",
        marginTop: "16px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.6)",
      }}
    >
      {children}
    </div>
  );
}
