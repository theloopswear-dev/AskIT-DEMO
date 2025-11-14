# AskIT AI - Quick Start Guide

Get AskIT AI running in under 5 minutes.

---

## Prerequisites

- Node.js 18+ installed
- OpenAI API key with Realtime API access
- Modern browser (Chrome, Firefox, Edge, Safari)
- Microphone permission

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Configure Environment

Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

**Get your API key**: https://platform.openai.com/api-keys

**Important**: Make sure your OpenAI account has:
- Access to Realtime API (gpt-4o-realtime-preview)
- Sufficient credits ($5+ recommended for testing)

---

## Step 3: Start Development Server

```bash
npm run dev
```

The app will open at: http://localhost:5173

---

## Step 4: Use AskIT AI

1. Click "Start Screen Share"
2. Select the screen/window you want to share
3. Allow microphone access when prompted
4. Start speaking in your preferred language
5. AskIT will guide you step-by-step

---

## Supported Languages

Speak naturally in any of these languages:

- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Hindi (हिंदी)
- English
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- And 50+ more languages

**No language selection needed** - AskIT detects automatically.

---

## Example Conversations

### Tamil
"Epudi Aadhar card download panrathu?"
(How to download Aadhaar card?)

### Telugu
"PAN card kosam ela apply cheyalo cheppandi"
(Tell me how to apply for PAN card)

### Hindi
"Income tax return kaise file kare?"
(How to file income tax return?)

### English
"Guide me through passport application"

---

## Troubleshooting

### Microphone Not Working
1. Check browser permissions (usually in address bar)
2. Ensure no other app is using the microphone
3. Try refreshing the page

### Screen Share Not Starting
1. Click "Start Screen Share" again
2. Make sure you select a screen/window in the picker
3. Grant permission when prompted

### AI Not Responding
1. Check your OpenAI API key in `.env`
2. Verify you have API credits remaining
3. Check browser console for errors (F12)
4. Ensure internet connection is stable

### No Voice Output
1. Check system volume settings
2. Ensure browser audio isn't muted
3. Try a different browser
4. Check browser console for audio errors

---

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

---

## Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

Add `VITE_OPENAI_API_KEY` in Vercel dashboard environment variables.

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Add `VITE_OPENAI_API_KEY` in Netlify dashboard environment variables.

---

## Cost Monitoring

Track your OpenAI API usage at: https://platform.openai.com/usage

**Estimated costs per session**:
- 5 minutes: ~$1.50
- 10 minutes: ~$3.00
- 30 minutes: ~$9.00

**Tip**: Set usage limits in OpenAI dashboard to control costs.

---

## Browser Requirements

Minimum versions:
- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+

Features required:
- WebRTC/MediaStream API
- Web Audio API
- WebSocket API
- Microphone access

---

## Privacy & Security

- Screen data sent to OpenAI for analysis only
- No local recording or storage
- Audio processed in real-time (not stored)
- Secure WebSocket (WSS) connection
- API key stored in environment variables

---

## Need Help?

1. Check browser console (F12) for errors
2. Review TRANSFORMATION.md for technical details
3. Ensure OpenAI API key has Realtime access
4. Test with English first, then try other languages
5. Verify microphone/screen permissions

---

## Next Steps

After basic setup:

1. Test with different government websites
2. Try various Indian languages
3. Experiment with different use cases
4. Monitor API usage and costs
5. Customize instructions in `openaiRealtime.ts`

---

Happy building! Making government services accessible to everyone in their native language.
