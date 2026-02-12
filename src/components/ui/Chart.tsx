"use client";

interface ChartProps {
  title?: string;
}

export default function Chart({ title }: ChartProps) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      {title && <h3>{title}</h3>}
      <p>📊 Mock Chart Placeholder</p>
    </div>
  );
}
