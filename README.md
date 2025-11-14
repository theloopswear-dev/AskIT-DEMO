
# AskIT AI - Your Multilingual Government Services Assistant

AskIT AI is a real-time, AI-powered screen-sharing assistant designed to help users navigate government services and everyday tasks through natural voice interaction. Inspired by Google Gemini Live Studio, AskIT understands and responds in multiple Indian languages including Tamil, Telugu, Hindi, and English.

---

## Features

- Real-time voice interaction with OpenAI Realtime API
- Automatic multilingual support (Tamil, Telugu, Hindi, English, etc.)
- Continuous screen analysis using GPT-4 Vision
- Step-by-step guidance for government services
- Tab-persistent conversation
- No typing required - fully voice-driven
- Automatic microphone activation on screen share

---

## How It Works

1. Click "Start Screen Share" to begin
2. Select the screen or window you want to share
3. AskIT automatically:
   - Activates your microphone
   - Starts listening in your preferred language
   - Analyzes your screen every 2-3 seconds
   - Provides spoken guidance based on what you see and say

---

## Use Cases

- Downloading Aadhaar card
- Applying for PAN card
- Filing income tax returns
- Booking train/bus tickets
- Any government service navigation
- General computer tasks with multilingual support

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/askit-ai.git
cd askit-ai
```

### 2. Install Dependencies

Make sure you have **Node.js (v18+)** installed.

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
```

> Note: You need an OpenAI API key with access to GPT-4 Vision and Realtime API.

### 4. Run the App

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to use AskIT AI.

---

## Project Structure

```
project/
├── public/                 # Static assets
├── src/                    # Main application source
│   ├── components/         # React components
│   │   └── AskITScreenShare.tsx  # Main screen sharing component
│   ├── hooks/              # Custom React hooks
│   │   └── useRealtimeVoice.ts   # Voice interaction hook
│   ├── services/           # API utilities
│   │   └── openaiRealtime.ts     # OpenAI Realtime service
│   ├── App.tsx             # Main app entry
│   └── main.tsx            # React entry point
├── .env                    # Environment variables
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration
```

---

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **AI**: OpenAI Realtime API, GPT-4 Vision
- **Voice**: Built-in OpenAI Whisper + TTS
- **Screen Capture**: Browser MediaStream API

---

## Key Features

### Automatic Language Detection
AskIT automatically detects and responds in your spoken language - no language selection needed.

### Continuous Screen Understanding
Every 2-3 seconds, AskIT captures and analyzes your screen to provide contextual guidance.

### Tab Persistence
The conversation continues even when you switch to other browser tabs.

### No Typing Required
Fully voice-driven interface - just speak naturally.

---

## Configuration

### OpenAI API Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Ensure you have access to:
   - GPT-4 Vision models
   - Realtime API (gpt-4o-realtime-preview)
3. Add the key to your `.env` file

---

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

---

## Deployment

Deploy to platforms like:

- Vercel: https://vercel.com/
- Netlify: https://www.netlify.com/
- Render: https://render.com/

Remember to add your `VITE_OPENAI_API_KEY` in the deployment platform's environment settings.

---

## Future Enhancements

- Native mobile apps (iOS/Android)
- Offline mode with cached guidance
- Integration with specific government portals
- Custom voice models for regional accents
- Multi-user collaboration

---

## License

This project is licensed under the MIT License.

---

Created for societal good - Making government services accessible to everyone in their native language.
