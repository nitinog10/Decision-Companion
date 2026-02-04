# AI Decision Companion

A consumer-focused AI web app that helps users make better daily decisions by comparing options and explaining WHY one option is better.

## Features

- **Decision Input**: Describe any daily decision you're facing
- **Context-Aware Analysis**: Set your goal, time available, energy level, and budget
- **Smart Comparisons**: AI generates 2-3 options with pros/cons
- **Impact Scores**: Short-term vs long-term impact visualization
- **Explainability**: "Why this?" section explains the reasoning
- **Decision History**: Last 5 decisions saved in session

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4o-mini (with mock fallback)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure OpenAI (Optional)

Create a `.env.local` file:

```env
OPENAI_API_KEY=your-openai-api-key
```

Get your API key from: https://platform.openai.com/api-keys

> The app works without an API key using intelligent mock responses.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## How It Works

1. Enter your decision question (e.g., "Should I attend class or work on my project?")
2. Select your primary goal (career, money, health, learning, productivity, relationships)
3. Set your current energy level (low, medium, high)
4. Enter time available and optional budget
5. Click "Analyze Decision"
6. Review the AI-generated options with pros/cons and impact scores
7. Read the "Why this?" explanation for the recommendation

## Example Decisions

- "Should I attend class or work on my project?"
- "Should I order food or cook at home?"
- "Should I learn React or continue ML?"

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # AI decision analysis API
│   ├── page.tsx               # Main app with state management
│   ├── layout.tsx             # App layout and metadata
│   └── globals.css            # Global styles
├── components/
│   ├── decision-input.tsx     # Input form with context fields
│   ├── decision-output.tsx    # Decision cards and explanation
│   └── decision-history.tsx   # History sidebar
└── lib/
    └── types.ts               # TypeScript type definitions
```

## Future Scope

- Emotion-aware decisions (mood tracking)
- Long-term memory (persistent user preferences)
- Mobile app version (React Native)
- Decision journaling and reflection
- Multi-language support

## License

MIT
