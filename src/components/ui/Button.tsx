import React from "react";

export function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn">{children}</button>;
}
