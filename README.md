# AI Agent Platform

An intelligent platform for managing specialized AI employees (Agents) across different professional domains.

## Overview

This platform allows users to interact with domain-specific AI agents that function as professional employees in their respective fields. Each agent is equipped with specialized skills and tools to provide expert-level services.

### Key Features

- **Agent Management**: Create, configure, and manage AI employees
- **Role-Based System**: Define roles with specific capabilities and permissions  
- **Skill Integration**: Associate roles with domain-specific skills and tools
- **Professional Services**: Agents provide expert solutions in their domains
- **3D/VR Output**: Support for WebGL-based 3D visualization and VR experiences
- **Natural Interaction**: Chat-based interface for seamless user experience

### Example Use Case

**Interior Design Agent**: 
- User provides floor plan, style preferences, and requirements
- Agent analyzes spatial constraints and design principles
- Generates optimal layout suggestions with material recommendations
- Outputs interactive WebGL VR preview for immersive viewing

## Technology Stack

- **Frontend**: Next.js 14 (App Router)
- **AI Framework**: LangChain
- **3D Rendering**: Three.js + WebGL
- **State Management**: React Context + Zustand
- **Styling**: Tailwind CSS + ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │   Agent Core    │    │   External APIs │
│   (Next.js)     │◄──►│   (LangChain)   │◄──►│   & Tools       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   3D Renderer   │    │   Skill Registry│
│   (Three.js)    │    │   & Tool Hub    │
└─────────────────┘    └─────────────────┘
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`

## Development

This project follows a modular architecture with clear separation of concerns:

- `app/` - Next.js application routes
- `lib/` - Core business logic and utilities  
- `types/` - TypeScript interfaces and types
- `public/` - Static assets and 3D models
- `docs/` - Documentation and specifications

## Contributing

Pull requests are welcome! Please ensure your code follows the established patterns and includes appropriate tests.