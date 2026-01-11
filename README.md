# 🧠 DocuMind AI

> **Eliminate the "Dread" from your PDFs.** Transform dense technical manuals, legal contracts, and academic papers into interactive, high-fidelity insights using the power of Google Gemini 3 Flash.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%203%20Flash-indigo?logo=google-gemini)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 The Experience

Reading a 50-page PDF shouldn't take hours. **DocuMind AI** acts as your personal document analyst. 

### Core Capabilities:
*   **⚡ Instant Cognition**: Get an executive summary in your preferred style (Brief/Detailed) and format (Narrative/Bullets).
*   **📊 Multi-Dimensional Analysis**: 
    *   **Key Takeaways**: Ranked list of the most critical insights.
    *   **Entity Extraction**: Hover over identified organizations, people, or technical terms to see their significance.
    *   **Sentiment & Pulse**: Visualizes the tone and complexity level of the writing.
*   **💬 Interactive Dialog**: A dedicated chat sidebar to interrogate your document.
*   **💡 Predictive Inquiries**: The AI generates "Context-Aware" follow-up questions after every response to help you dive deeper.

---

## 🏗 Architecture & NLP Pipeline

DocuMind AI uses a sophisticated stateless pipeline to process your documents securely:

1.  **Binary Processing**: Files are converted to Base64 in-browser (ensuring no server-side persistence).
2.  **Structured Prompting**: Gemini 3 Flash is queried with a custom JSON Schema to ensure 100% predictable output.
3.  **NLP Task Orchestration**: 
    -   *Summarization* via tailored system instructions.
    -   *Entity Recognition* for semantic mapping.
    -   *Sentiment Analysis* for contextual tone.
4.  **Feedback Loop**: Each chat cycle triggers a secondary inference task to update the "Intelligent Follow-ups" based on the new conversation context.

---

## 🚀 Deployment & Setup

### 1. Prerequisites
-   An API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   A paid GCP project if using advanced image/video features (though this app focuses on PDF Text).

### 2. Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/documind-ai.git
cd documind-ai

# Install dependencies
npm install

# Set up environment
echo "API_KEY=your_key_here" > .env

# Launch
npm run dev
```

### 3. Production Deployment
This project is Vite-based and ready for 1-click deployment to **Vercel** or **Netlify**.
> **Important**: Add your `API_KEY` to the provider's Environment Variables settings.

---

## 📂 Project Structure

```text
src/
├── components/          
│   ├── AnalysisView.tsx   # Dashboard for document metrics
│   ├── ChatInterface.tsx  # Dynamic Q&A component
│   └── Icons.tsx          # Consistent SVG iconography
├── services/            
│   └── geminiService.ts   # Core AI logic & JSON Schema definitions
├── types.ts               # Centralized TypeScript interfaces
└── App.tsx                # State orchestration & File pipeline
```

## 🗺 Roadmap
- [ ] OCR Support for scanned/image-based PDFs.
- [ ] Multi-document comparison mode.
- [ ] Export analysis as a professional Markdown report.

---

## ⚖️ License
This project is open-source under the [MIT License](LICENSE). Built with ❤️ for productive reading.
