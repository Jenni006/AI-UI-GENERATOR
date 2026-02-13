"use client";

import { useState, useEffect } from "react";
import Renderer from "@/components/Renderer";
import Button from "@/components/ui/Button";

interface HistoryItem {
  prompt: string;
  schema: any;
  explanation: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [schema, setSchema] = useState<any>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonError, setJsonError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  // Live reload JSON editor
  useEffect(() => {
    if (!generatedCode) return;

    try {
      const parsed = JSON.parse(generatedCode);
      setSchema(parsed);
      setJsonError("");
    } catch (err: any) {
      setJsonError(err.message);
    }
  }, [generatedCode]);

  const generateUI = async () => {
    if (!prompt) return;

    setLoading(true);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          previousSchema: schema,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setSchema(data.schema);
      setGeneratedCode(JSON.stringify(data.schema, null, 2));
      setExplanation(data.explanation);

      setHistory((prev) => [
        ...prev,
        {
          prompt,
          schema: data.schema,
          explanation: data.explanation,
        },
      ]);

      setSelectedVersion(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const rollback = () => {
    if (!history.length) return;

    const prev = history[history.length - 1];

    setPrompt(prev.prompt);
    setSchema(prev.schema);
    setGeneratedCode(JSON.stringify(prev.schema, null, 2));
    setExplanation(prev.explanation);

    setHistory((prevArr) => prevArr.slice(0, -1));
  };

  const replayHistory = (index: number) => {
    const item = history[index];

    setSelectedVersion(index);
    setPrompt(item.prompt);
    setSchema(item.schema);
    setGeneratedCode(JSON.stringify(item.schema, null, 2));
    setExplanation(item.explanation);
  };

  const renderDiff = () => {

    if (history.length < 2) {
      return (
        <div style={{ color: "#888", fontStyle: "italic" }}>
          No previous version to compare.
        </div>
      );
    }

    const current = history[history.length - 1].schema;
    const previous = history[history.length - 2].schema;

    const prevStr = JSON.stringify(previous, null, 2);
    const currStr = JSON.stringify(current, null, 2);

    const prevLines = prevStr.split("\n");
    const currLines = currStr.split("\n");

    return currLines.map((line, i) => {
      const changed = line !== prevLines[i];

      return (
        <div
          key={i}
          style={{
            backgroundColor: changed
              ? "rgba(255,255,0,0.2)"
              : "transparent",
            fontFamily: "monospace",
            whiteSpace: "pre",
          }}
        >
          {line}
        </div>
      );
    });
  };


  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          width: "30%",
          padding: "20px",
          borderRight: "1px solid #444",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2>Iterative AI UI Builder</h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your UI..."
            style={{
              width: "100%",
              height: "120px",
              marginBottom: "12px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#2e2e2e",
              color: "#fff",
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <Button
              label={loading ? "Generating..." : "Generate UI"}
              onClick={generateUI}
            />
            <Button
              label="Rollback"
              onClick={rollback}
              style={{ backgroundColor: "#6c757d" }}
            />
          </div>

          {/* History Dropdown Style */}
          <h4 style={{ marginBottom: "8px" }}>Previous Generations</h4>
          <div
            style={{
              maxHeight: "40vh",
              overflowY: "auto",
              border: "1px solid #333",
              borderRadius: "6px",
            }}
          >
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => replayHistory(index)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #333",
                  backgroundColor:
                    selectedVersion === index
                      ? "#2a2a2a"
                      : "transparent",
                }}
              >
                {item.prompt.length > 50
                  ? item.prompt.slice(0, 50) + "..."
                  : item.prompt}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          width: "70%",
          padding: "20px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Code + Diff */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Code Editor */}
          <div style={{ flex: 1 }}>
            <h3>Generated JSON</h3>
            <textarea
              value={generatedCode}
              onChange={(e) => setGeneratedCode(e.target.value)}
              style={{
                width: "100%",
                height: "300px",
                fontFamily: "monospace",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                border: jsonError
                  ? "2px solid red"
                  : "1px solid #444",
                borderRadius: "6px",
                padding: "10px",
              }}
            />
            {jsonError && (
              <div
                style={{
                  color: "red",
                  marginTop: "6px",
                  fontFamily: "monospace",
                }}
              >
                Error: {jsonError}
              </div>
            )}
          </div>

          {/* Diff View */}
          {history.length > 0 && (
            <div style={{ flex: 1 }}>
              <h3>Difference</h3>
              <div
                style={{
                  backgroundColor: "#111",
                  padding: "10px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  borderRadius: "6px",
                  border: "1px solid #444",
                }}
              >
                {renderDiff()}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div>
          <h3>Live Preview</h3>
          <div
            style={{
              minHeight: "200px",
              backgroundColor: "#2e2e2e",
              borderRadius: "6px",
              padding: "20px",
            }}
          >
            {schema && <Renderer schema={schema} />}
          </div>
        </div>

        {/* AI Explanation */}
        <div>
          <h3>AI Explanation</h3>
          <div
            style={{
              backgroundColor: "#2a2a2a",
              padding: "16px",
              borderRadius: "10px",
              color: "#ddd",
            }}
          >
            {explanation}
          </div>
        </div>
      </div>
    </div>
  );
}
