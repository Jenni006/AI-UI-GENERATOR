"use client";

import { renderNode } from "@/lib/renderer";

export default function Home() {
  const sampleJSON = {
    type: "Card",
    children: [
      {
        type: "Input",
        placeholder: "Enter name",
      },
      {
        type: "Button",
        content: "Submit",
      },
    ],
  };

  return <div>{renderNode(sampleJSON)}</div>;
}
