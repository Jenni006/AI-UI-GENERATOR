"use client";

import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Navbar from "./ui/Navbar";
import Sidebar from "./ui/Sidebar";
import Table from "./ui/Table";
import Chart from "./ui/Chart";

const componentMap: any = {
  Button,
  Card,
  Input,
  Modal,
  Navbar,
  Sidebar,
  Table,
  Chart,
};

interface RendererProps {
  schema: any;
}

export default function Renderer({ schema }: RendererProps) {
  if (!schema) return null;

  const renderComponent = (component: any, index: number) => {
    const Component = componentMap[component.type];

    if (!Component) {
      return <div key={index}>Invalid component</div>;
    }

    const props = component.props || {};
    const children = component.children || [];

    return (
      <Component key={index} {...props}>
        {Array.isArray(children) &&
          children.map((child: any, i: number) =>
            renderComponent(child, i)
          )}
      </Component>
    );
  };

  return (
    <div
      style={{
        display: schema.layout === "horizontal" ? "flex" : "block",
        gap: "16px",
      }}
    >
      {schema.components?.map((comp: any, index: number) =>
        renderComponent(comp, index)
      )}
    </div>
  );
}
