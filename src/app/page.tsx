"use client";

import { useState, useEffect } from "react";
import Renderer from "@/components/Renderer";
import Button from "@/components/ui/Button";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [jsonError, setJsonError] = useState("");

  // Live reload: update preview when code changes
  useEffect(() => {
    if (!generatedCode) return;
    try {
      const updatedSchema = JSON.parse(generatedCode);
      setSchema(updatedSchema);
      setJsonError(""); 
    } catch {
      // ignore invalid JSON while typing
    }
  }, [generatedCode]);

  const generateUI = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, previousSchema: schema }),
      });

      const data = await res.json();

      if (schema) setHistory((prev) => [...prev, schema]);

      setSchema(data.schema);
      setGeneratedCode(JSON.stringify(data.schema, null, 2));
      setExplanation(data.explanation);
    } catch (err) {
      console.error("Failed to generate:", err);
    } finally {
      setLoading(false);
    }
  };

  const rollback = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setSchema(previous);
    setGeneratedCode(JSON.stringify(previous, null, 2));
    setHistory((prev) => prev.slice(0, -1));
  };

  const renderDiff = () => {
    if (!history.length || !schema) return null;
    const prevStr = JSON.stringify(history[history.length - 1], null, 2);
    const currStr = JSON.stringify(schema, null, 2);
    const prevLines = prevStr.split("\n");
    const currLines = currStr.split("\n");
    
    return currLines.map((line, i) => (
      <div
        key={i}
        style={{
          backgroundColor: line !== prevLines[i] ? "rgba(255,255,0,0.2)" : "transparent",
          fontFamily: "monospace",
          whiteSpace: "pre",
        }}
      >
        {line}
      </div>
    ));
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#1e1e1e", color: "#fff", overflow: "hidden" }}>
      {/* LEFT PANEL: Chat / Control */}
      <div
        style={{
          width: "30%",
          padding: "20px",
          borderRight: "1px solid #444",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>AI UI Generator</h2>

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
            resize: "none",
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            label={loading ? "Generating..." : "Generate UI"}
            onClick={generateUI}
          />
          <Button
            label="Rollback"
            onClick={rollback}
            style={{ backgroundColor: "#4a4a4a" }}
          />
        </div>

        <h3 style={{ marginTop: "30px" }}>AI Explanation</h3>
        <div
          style={{
            backgroundColor: "#111",
            color: "#ccc",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            lineHeight: "1.4",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {explanation || "Describe a UI to see the AI's reasoning..."}
        </div>
      </div>

      {/* RIGHT PANEL: Code & Preview */}
      <div style={{ width: "70%", padding: "20px", overflowY: "auto" }}>
        
        {/* Top Section: Code and Diff */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div style={{ flex: 1 }}>
            <h3>Generated Code</h3>
            <textarea
              value={generatedCode}
              onChange={(e) => {
                setGeneratedCode(e.target.value);
                try {
                  const parsed = JSON.parse(e.target.value);
                  setSchema(parsed);
                  setJsonError("");
                } catch (err: any) {
                  setJsonError(err.message);
                }
              }}
              style={{
                width: "100%",
                height: "300px",
                fontFamily: "monospace",
                backgroundColor: "#1e1e1e",
                color: "#fff",
                border: jsonError ? "2px solid #ff4444" : "1px solid #444",
                borderRadius: "6px",
                padding: "10px",
              }}
            />
            {jsonError && (
              <div style={{ color: "#ff4444", marginTop: "6px", fontSize: "12px", fontFamily: "monospace" }}>
                JSON Error: {jsonError}
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div style={{ flex: 1 }}>
              <h3>Previous Version</h3>
              <div
                style={{
                  backgroundColor: "#111",
                  padding: "10px",
                  height: "300px",
                  overflowY: "auto",
                  borderRadius: "6px",
                  border: "1px solid #444",
                  fontSize: "12px",
                }}
              >
                {renderDiff()}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Live Preview */}
        <h3>Live Preview</h3>
        <div
          style={{
            marginBottom: "20px",
            padding: "20px",
            backgroundColor: "#1e1e1e", 
            color: "#fff",
            borderRadius: "8px",
            minHeight: "150px",
            border: "1px solid #444",
          }}
        >
          {schema ? <Renderer schema={schema} /> : (
             <div style={{ color: "#888", textAlign: "center", marginTop: "100px" }}>
               Preview will appear here...
             </div>
          )}
        </div>
      </div>
    </div>
  );
}