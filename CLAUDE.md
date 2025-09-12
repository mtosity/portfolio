# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code linting

### Package Manager
This project uses **pnpm** as the package manager (not npm or yarn).

## Architecture Overview

This is a **Next.js 14** portfolio website built with **TypeScript**, **Tailwind CSS**, and **Sass modules**. The project uses the App Router architecture.

### Key Technologies
- **Next.js 14** with App Router
- **TypeScript** with strict mode enabled
- **Tailwind CSS** for utility-first styling
- **Sass modules** for component-specific styles
- **Framer Motion** for animations and scroll-based interactions
- **Lottie** animations via `@lottiefiles/react-lottie-player`
- **Anime.js** for additional animations
- **Vercel Analytics** for tracking

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata and analytics
│   ├── page.tsx                 # Main home page
│   └── globals.css              # Global styles
└── components/
    ├── mtosity.tsx              # Main animated logo component
    ├── SlideTabs.tsx           # Navigation tabs component
    └── template/               # Reusable template components
        ├── buttons/            # Button components with Sass modules
        ├── home/              # Home page sections
        │   ├── about/         # About section
        │   ├── contact/       # Contact section
        │   ├── experience/    # Experience section
        │   ├── hero/          # Hero section (commented out)
        │   └── projects/      # Projects section with modal
        ├── nav/               # Navigation components
        └── utils/             # Utility components
```

### Styling Architecture
- **Global styles**: `src/app/globals.css`
- **Component styles**: Sass modules (`.module.scss`) co-located with components
- **Utility classes**: Tailwind CSS for rapid styling
- **Naming convention**: Kebab-case for Sass module files

### Key Components
- `MTosity`: Complex animated logo component with scroll-triggered transformations
- `SlideTabs`: Sticky navigation component
- Each major section (About, Projects, Experience, Contact) is a separate component
- Extensive use of Framer Motion for scroll-based and state-based animations

### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled
- Includes Next.js plugin for enhanced development experience

### ESLint Configuration
- Extends `next/core-web-vitals` and `next/typescript`
- Disables `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-expressions`

### Performance Considerations
- Uses Next.js Image component for optimized images
- Lottie animations for vector graphics
- Framer Motion for performant animations
- Vercel Analytics integration

### Development Notes
- The project uses custom fonts (Tektur from Google Fonts)
- Includes comprehensive SEO meta tags and Open Graph data
- Features a complex scroll-triggered animation system in the main MTosity component
- Uses both Tailwind and Sass modules for styling flexibility