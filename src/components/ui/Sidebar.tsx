"use client";

interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#f3f4f6",
        padding: "16px",
      }}
    >
      {children}
    </div>
  );
}
