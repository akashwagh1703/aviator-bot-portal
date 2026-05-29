# Aether AI — AI Avatar Assistant Platform

A modern, lightweight, **config-driven** AI avatar assistant. It talks, animates,
and responds with AI — featuring multiple configurable characters, each with its
own voice, personality, theme and animated SVG avatar.

Built to be deployed on **Vercel** with no database, no auth, and no backend
server beyond a single streaming API route.

## ✨ Features

- **AI chat** with streaming, ChatGPT-style progressive rendering (OpenRouter)
- **Animated SVG avatars** with blinking, talking mouth sync & idle float
- **Emotion engine** — idle / happy / thinking / talking / listening
- **Voice output** via the browser SpeechSynthesis API (per-character voices)
- **Voice input** via the browser SpeechRecognition API (auto-send, graceful fallback)
- **Config-driven characters** — avatars, voices, personalities & themes
- **Theme engine** — dark, glassmorphism, animated gradients (CSS-variable based)
- **Conversation memory** persisted to `localStorage` (survives refresh)
- **Centralized audio management** — no overlapping voices, mute, auto-stop on switch
- **Accessible & responsive**, mobile-first, premium SaaS UI

## 🧱 Tech Stack

Next.js 15 (App Router) · React 19 · JavaScript · Tailwind CSS · Framer Motion ·
Zustand · Lucide React · OpenRouter API · Browser Speech APIs

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local   # then add your OpenRouter key
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable               | Required | Description                                  |
| ---------------------- | -------- | -------------------------------------------- |
| `OPENROUTER_API_KEY`   | ✅       | OpenRouter key (https://openrouter.ai/keys)  |
| `OPENROUTER_MODEL`     | ⬜       | Model override (default `openai/gpt-4o-mini`) |
| `NEXT_PUBLIC_APP_NAME` | ⬜       | App name shown in the UI                     |

> The chat UI renders without a key, but AI replies require `OPENROUTER_API_KEY`.

## 🗂️ Project Structure

```
src/
├── app/                  # App Router: layout, page, globals.css, api/chat
├── components/
│   ├── avatar/           # Avatar stage + CharacterSelector
│   ├── chat/             # ChatWindow, ChatMessage, ChatInput, VoiceInput, TypingIndicator
│   ├── layout/           # Header + AssistantApp orchestrator
│   └── ui/               # Toast system
├── configs/              # avatars, voices, personalities, themes (+ index)
├── avatar-engine/        # Reusable avatar abstraction + SVG renderers
├── hooks/                # useSpeech, useSpeechRecognition, useChat
├── lib/                  # openrouter client + utils (theme/format)
└── store/                # Zustand store (persisted)
```

## 🧩 Adding a new character

Add an entry to `src/configs/avatars.js` referencing a `voice`, `personality`,
`theme` and a renderer `render` key. Add new voices/personalities/themes in their
respective config files and (optionally) a new SVG renderer in
`src/avatar-engine/renderers/`. No component changes required.

## 🔮 Built for the future

The avatar engine is an abstraction layer (SVG today; Lottie/3D ready) and the
config-driven architecture is designed to later swap local configs for a DB,
admin portal, auth, multi-tenant SaaS, premium voice packs and more.

## ☁️ Deploy on Vercel

Push to a Git repo, import into Vercel, set the environment variables, and deploy.

## 📦 Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Run the production build   |
| `npm run lint`  | Lint the project           |
