import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type UINode = {
  type: string;
  content?: string;
  placeholder?: string;
  children?: UINode[];
};

const allowedComponents = ["Button", "Card", "Input"];

export function renderNode(node: UINode): React.ReactNode {
  if (!allowedComponents.includes(node.type)) {
    throw new Error(`Component ${node.type} is not allowed.`);
  }

  switch (node.type) {
    case "Button":
      return <Button>{node.content}</Button>;

    case "Card":
      return (
        <Card>
          {node.children?.map((child, index) => (
            <div key={index}>{renderNode(child)}</div>
          ))}
        </Card>
      );

    case "Input":
      return <Input placeholder={node.placeholder} />;

    default:
      return null;
  }
}
