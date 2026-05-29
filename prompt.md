# AI Avatar Assistant Platform - Full Project Prompt

## Project Overview

Create a modern AI Avatar Assistant web application using Next.js 15, Tailwind CSS, Framer Motion, and configurable SVG avatars.

The platform should provide a conversational AI assistant with:

* AI chat
* speech output
* animated SVG/cartoon avatar
* configurable character system
* configurable voice system
* emotion animations
* responsive SaaS-style UI

The entire project should be configuration-driven using local config files only.

DO NOT use:

* database
* admin panel
* authentication
* backend server
* heavy AI rendering
* real human video generation

The project must be lightweight and deployable on Vercel.

---

# Tech Stack

## Core

* Next.js 15 App Router
* React
* JavaScript (NOT TypeScript)
* Tailwind CSS

## Libraries

* Framer Motion
* Zustand
* Lucide React

## APIs

* OpenRouter AI API
* Browser SpeechSynthesis API
* Browser SpeechRecognition API (if available)

---

# Main Features

## 1. AI Chat System

Build a modern AI chat interface.

Requirements:

* user message input
* send button
* enter key support
* streaming-like AI responses
* message history in local state only
* loading state
* typing indicator

The AI response should come from OpenRouter API.

Create API route:

```text
/app/api/chat/route.js
```

Use environment variable:

```env
OPENROUTER_API_KEY=
```

The AI should support configurable personality prompts.

---

# 2. SVG Avatar System

Create a fully reusable avatar engine.

Requirements:

* SVG-based avatars
* avatar image display
* blinking animation
* mouth talking animation
* idle floating animation
* smooth transitions

The avatar should animate while speech is playing.

Create reusable component:

```text
/components/avatar/Avatar.jsx
```

---

# 3. Character Configuration System

The entire system must be config-driven.

Create config folder:

```text
/src/configs/
```

Create:

```text
avatars.js
voices.js
personalities.js
themes.js
```

Example avatar config:

```js
{
  id: "sophia",
  name: "Sophia",
  avatar: "/avatars/sophia.svg",
  voice: "female-soft",
  personality: "friendly",
  theme: "modern"
}
```

The app should dynamically load:

* avatar
* voice
* personality
* theme

based on selected character.

---

# 4. Voice System

Use browser SpeechSynthesis API.

Requirements:

* configurable voices
* male/female support
* pitch/rate settings
* start/stop speaking
* speech cancellation support

Create reusable hook:

```text
/hooks/useSpeech.js
```

The avatar mouth animation should sync with speaking state.

---

# 5. Speech Recognition

Use browser speech recognition if supported.

Requirements:

* mic button
* speech-to-text
* auto-send recognized text
* fallback if browser unsupported

Create:

```text
/components/chat/VoiceInput.jsx
```

---

# 6. Emotion Engine

Create basic emotion states.

Supported emotions:

* idle
* happy
* thinking
* talking

The avatar should visually react.

Use Framer Motion animations.

---

# 7. Character Selector

Create a character switcher UI.

Requirements:

* select avatar
* change voice automatically
* change personality automatically
* update theme automatically

Create:

```text
/components/avatar/CharacterSelector.jsx
```

---

# 8. Theme Engine

Themes must be config-driven.

Support:

* dark mode
* modern gradients
* glassmorphism UI
* dynamic colors

Use Tailwind classes dynamically.

---

# 9. Modern UI/UX

The application should look premium and futuristic.

Design Requirements:

* full-screen layout
* centered avatar
* floating chat area
* modern cards
* smooth animations
* responsive mobile-first design

Use:

* gradients
* glass effects
* rounded corners
* blur effects

---

# 10. State Management

Use Zustand.

Store:

* selected avatar
* current voice
* current emotion
* chat history
* speaking state

Create:

```text
/store/useAssistantStore.js
```

---

# 11. Folder Structure

Generate clean scalable structure:

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js
│   │
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── avatar/
│   ├── chat/
│   ├── layout/
│   └── ui/
│
├── configs/
│   ├── avatars.js
│   ├── voices.js
│   ├── personalities.js
│   └── themes.js
│
├── hooks/
│   ├── useSpeech.js
│   └── useSpeechRecognition.js
│
├── lib/
│
├── store/
│   └── useAssistantStore.js
│
├── avatars/
│
└── styles/
```

---

# 12. OpenRouter Integration

Integrate OpenRouter AI API.

Requirements:

* reusable AI utility
* streaming-style response rendering
* system prompt support
* configurable model support

Use:

```text
https://openrouter.ai/api/v1/chat/completions
```

Default model:

```text
openai/gpt-4o-mini
```

---

# 13. Initial Characters

Create at least 3 characters:

* Sophia (friendly female)
* RobotX (technical robot)
* Neo (anime-style assistant)

Each must have:

* unique voice
* unique theme
* unique personality

---

# 14. Animations

Use Framer Motion extensively.

Required animations:

* avatar floating
* mouth movement
* blinking
* message fade-in
* smooth transitions
* hover effects

---

# 15. Responsive Design

Must work perfectly on:

* desktop
* tablet
* mobile

Mobile design is very important.

---

# 16. Deployment

The project must:

* build successfully
* deploy on Vercel
* use environment variables correctly
* have clean production-ready code

---

# 17. Coding Standards

Requirements:

* reusable components
* modular architecture
* scalable folder structure
* clean code
* comments where necessary
* avoid hardcoded values
* use config-driven architecture everywhere

---

# 18. IMPORTANT RULES

DO NOT:

* use database
* use authentication
* use TypeScript
* use server-side heavy AI models
* use Python
* use external backend

ONLY:

* Next.js
* browser APIs
* OpenRouter API
* config-driven architecture

---

# Final Goal

Build a fully working MVP AI Avatar Assistant Platform that:

* talks
* animates
* responds with AI
* supports multiple configurable avatars
* supports configurable voices
* supports configurable personalities
* has modern SaaS UI
* is deployable on Vercel
* is lightweight and scalable

The generated project should be complete, production-ready, cleanly structured, and visually impressive.

# 19. Conversation Engine

The AI assistant should support:

* contextual conversations
* previous message memory in session
* configurable max history
* message persistence in local state

Implement:

* assistant messages
* user messages
* loading states
* typing indicators

Conversation state should survive page refresh using localStorage.

---

# 20. Streaming AI Responses

AI responses should render progressively like ChatGPT.

Requirements:

* streaming-like text animation
* partial text rendering
* typing effect
* smooth scrolling

Do NOT wait for complete response before rendering.

---

# 21. Avatar Speaking Synchronization

The avatar animation engine must support:

* speaking state
* idle state
* listening state
* thinking state

Mouth animation should automatically start when:

* speech starts

And stop when:

* speech ends

The avatar should visually react during:

* AI thinking
* speech recognition
* speaking

---

# 22. Audio Management System

Implement centralized audio handling.

Requirements:

* stop previous speech before new speech
* prevent overlapping voices
* mute/unmute toggle
* auto-stop on character switch
* speech cleanup on component unmount

---

# 23. Reusable Avatar Engine

The avatar engine must be fully reusable.

Future-ready architecture:

* support SVG avatars
* support Lottie avatars later
* support 3D avatars later

Create abstraction layer:

```text
/avatar-engine/
```

Avoid tightly coupling avatar rendering logic.

---

# 24. Performance Optimization

The application must be optimized for:

* low-end laptops
* mobile devices
* smooth animations

Requirements:

* lazy load heavy components
* avoid unnecessary re-renders
* optimize animation loops
* minimize bundle size

Use dynamic imports where appropriate.

---

# 25. Error Handling

Implement professional error handling.

Requirements:

* AI API failure handling
* speech API unsupported handling
* microphone permission handling
* network failure handling
* empty response handling

Display elegant UI alerts/toasts.

---

# 26. Accessibility

Implement accessibility support:

* keyboard navigation
* screen reader labels
* proper button aria labels
* focus states
* responsive font sizing

---

# 27. Future Scalability Preparation

Even though current version uses config files only, architecture should be future-ready for:

* database integration
* admin portal
* SaaS multi-tenant support
* authentication
* subscription plans
* cloud voice providers

Avoid hardcoded architecture.

---

# 28. Advanced UI Features

Add:

* animated gradients
* glassmorphism cards
* animated mic button
* AI glow effects
* floating avatar effects
* smooth page transitions

The app should feel futuristic and premium.

---

# 29. Environment Configuration

Create proper environment setup.

Required:

```env
OPENROUTER_API_KEY=
NEXT_PUBLIC_APP_NAME=
```

Use centralized config handling.

---

# 30. Production Readiness

The generated project must:

* pass production build
* avoid hydration issues
* avoid client/server mismatches
* follow Next.js best practices
* use App Router correctly

Code must be production-ready and deployment-ready.

---

# 31. Future Premium Features Preparation

Architecture should allow future implementation of:

* avatar marketplace
* premium voice packs
* custom personalities
* AI memory system
* multilingual assistants
* real-time voice conversations
* custom avatar builder

Design system modularly for future expansion.
