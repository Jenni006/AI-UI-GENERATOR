# AI UI Generator

## Project Overview

AI UI Generator is a Next.js and TypeScript based web application that converts natural language prompts into structured UI schemas and dynamically renders them into functional user interface components. The system enables developers to describe UI requirements in plain English and instantly generate structured layouts with validated schemas, streaming responses, and version handling.

The application is designed for scalability, reliability, and safe AI integration using structured JSON validation and controlled rendering logic.

---

## Key Features

- Prompt-based UI generation from natural language
- Structured JSON schema output
- Dynamic component rendering
- Streaming AI responses
- Incremental UI updates
- Version replay and comparison support
- Safe JSON parsing with fallback handling
- Schema validation before rendering
- Chat-style history interface
- Error handling and recovery mechanisms
- Vercel-ready deployment

---

## Architecture Overview

The system follows a modular architecture using the Next.js App Router.

### Core Layers

**Frontend (React + Next.js)**
- Prompt input interface
- Chat-style conversation history
- Dynamic UI Renderer
- Version selection and replay
- AI explanation panel

**API Layer (Next.js Route Handlers)**
- AI prompt processing
- Streaming response handling
- Safe JSON parsing
- Schema validation
- Incremental edits support

**Validation & Rendering Layer**
- Component schema validation
- Static output analysis
- Safe renderer to prevent runtime crashes

---

## System Components

### 1. Input Handler
Captures user prompts and sends structured requests to the backend API.

### 2. AI Processing Module
Generates structured UI schemas based on user input using controlled prompts and strict response rules.

### 3. Schema Validator
Validates AI output before rendering to prevent malformed UI structures.

### 4. Preview Renderer
Dynamically renders components such as:
- Card
- Input
- Button
- Modal
- Layout containers

### 5. Version Handler
Stores previous generations and allows replay in a chat-style format.

### 6. Explanation Engine
Generates concise plain-text explanations for UI decisions without exposing raw schema or markdown.

---

## How It Works

1. User enters a UI description.
2. The backend sends a structured prompt to the AI.
3. The AI returns a JSON schema.
4. The system safely parses and validates the schema.
5. The Renderer dynamically generates the UI.
6. The explanation engine provides a brief design explanation.
7. Previous generations are stored for replay and comparison.

---

## Technology Stack

- Next.js (App Router)
- React
- TypeScript
- API Route Handlers
- JSON Schema Validation
- Streaming AI Responses
- Vercel Deployment Support

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Jenni006/AI-UI-GENERATOR.git


## License
This project is licensed under the MIT License.

---
