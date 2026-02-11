import React from "react";

export function Input({ placeholder }: { placeholder?: string }) {
  return <input className="input" placeholder={placeholder} />;
}
