"use client";

import { useState } from "react";
import Renderer from "@/components/Renderer";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateUI = async () => {
    if (!prompt) return;

    setLoading(true);

    const res = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (schema) {
      setHistory((prev) => [...prev, schema]);
    }

    setSchema(data.schema);
    setGeneratedCode(data.code);
    setExplanation(data.explanation);

    setLoading(false);
  };

  const rollback = () => {
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    setSchema(previous);
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT PANEL */}
      <div
        style={{
          width: "30%",
          padding: "20px",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>AI UI Generator</h2>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your UI..."
          style={{ width: "100%", height: "120px", marginBottom: "12px" }}
        />

        <button onClick={generateUI} disabled={loading}>
          {loading ? "Generating..." : "Generate UI"}
        </button>

        <button
          onClick={rollback}
          style={{ marginLeft: "10px" }}
        >
          Rollback
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: "70%", padding: "20px", overflow: "auto" }}>
        
        <h3>Generated Code</h3>
        <textarea
          value={generatedCode}
          readOnly
          style={{
            width: "100%",
            height: "200px",
            marginBottom: "20px",
          }}
        />

        <h3>Live Preview</h3>
        <div style={{ marginBottom: "20px" }}>
          {schema && <Renderer schema={schema} />}
        </div>

        <h3>AI Explanation</h3>
        <div
          style={{
            backgroundColor: "#111",
            color: "#ffffff",
            padding: "16px",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
            marginTop: "10px",
          }}
        >
          {explanation}
        </div>

      </div>
    </div>
  );
}
