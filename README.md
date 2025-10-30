## AI Agent (Doctor/Caregiver Appointment Assistant)

Helps users chat with an AI assistant to book appointments with doctors or caregivers.

### Tech Stack
- **Next.js**: 16
- **React**: 19
- **TypeScript**: 5
- **MUI (Material UI)**: 7 (+ Emotion)
- **Tailwind CSS**: 4
- **Google Generative AI**: `@google/genai`

### Prerequisites
- **Node.js**: 20.x LTS (recommended) or newer
- **npm**: 10+ (bundled with Node 20)
- macOS, Linux, or Windows

### Project Structure
- App directory: `src/app`
- Chat components: `src/component/chat`
- API route: `src/app/api/appointment/route.js`

### 1) Clone and Install
```bash
cd ai-agent
npm install
```

No need to manually install `@google/genai` — it is already listed in dependencies.

### 2) Environment Variables
Create a `.env.local` file in `ai-agent/` with your Google Gemini API key:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Notes:
- The key is used on the client by `@google/genai` in `src/component/chat/ai_agent.tsx`.
- Keys prefixed with `NEXT_PUBLIC_` are exposed to the browser; use a non-public key only if you proxy requests via a server.

### 3) Run the App
```bash
npm run dev
```
Open `http://localhost:3000`.

Build and start (production):
```bash
npm run build
npm start
```

### 4) Using the Chatbot
- The floating chat widget is rendered by `src/component/chat/back_up.tsx` and used on `src/app/page.tsx` and `src/app/agent/page.tsx`.
- The assistant streams responses from the Gemini model specified in code (`gemini-2.5-flash`).

### API Endpoints (Local)
- `GET /api/appointment` → health check, returns a hello message
- `POST /api/appointment` → accepts JSON and returns a dummy "Booked" message

Example `POST` body (the chat component internally calls booking via `Book()`):
```json
{
  "patient_name": "John Doe",
  "doctor_name": "Dr. Jesse",
  "book_date": "2025-11-03T07:00:00Z"
}
```

### Troubleshooting
- Ensure Node 20+ is installed: `node -v`
- Verify your `.env.local` exists and the key is valid.
- If you change environment variables, restart `npm run dev`.
- If MUI styles look off, confirm `@emotion/react` and `@emotion/styled` are installed (they are in `package.json`).

### Where to Customize
- System instruction for the assistant: `src/component/chat/system_instruction.ts` (pulls mock doctor/slots from `src/fetch_data/fetch_slot.ts`).
- Chat UI and model config: `src/component/chat/ai_agent.tsx`.
- Home page integration: `src/app/page.tsx`.
- Agent page: `src/app/agent/page.tsx`.

### Scripts
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm start` — run production build
