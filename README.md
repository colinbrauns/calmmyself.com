# CalmMyself.com

Your personal toolbox for nervous system regulation and calming techniques.

🚀 **Status**: Production ready with Docker deployment

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm test
```

## Project Structure

```
src/
├── app/                     # Next.js app router
├── components/              # Reusable components
│   ├── ui/                 # Basic UI elements
│   └── tools/              # Calming tool components
├── features/               # Feature-based modules
│   ├── breathing/          # Breathing exercises
│   ├── grounding/          # Grounding techniques
│   ├── mindfulness/        # Mindfulness tools
│   ├── visualization/      # Guided visualizations
│   └── progressive-relaxation/
├── lib/                    # Utilities and configurations
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript definitions
```

## Development Guidelines

- Follow accessibility-first development (WCAG 2.2 AA)
- All techniques must be evidence-based
- Privacy-first: no user data collection
- Offline-first PWA architecture
- Performance budget: <2s load time

## Available Tools

### Phase 1 (MVP)
- [ ] Box breathing
- [ ] Triangle breathing  
- [ ] 5-4-3-2-1 grounding
- [ ] Progressive muscle relaxation

### Phase 2
- [ ] Guided visualizations
- [ ] Crisis support resources
- [ ] Advanced breathing patterns

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## Deployment

Static site optimized for edge deployment. Supports:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static host

---

Built with accessibility, privacy, and user safety as top priorities.