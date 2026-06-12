# CreativeDox — Step-by-Step Development Prompts (UPDATED v2)

## How to Use This Document

- Copy ONE prompt at a time and paste it into Claude
- Wait for the complete code to be generated and tested
- Review and confirm before moving to the next prompt
- Each prompt builds on the previous one
- Do NOT skip prompts — they are sequential and dependent

---

# PHASE 1: Project Setup & Foundation

---

## Prompt 1 — Project Initialization

```
Act as a Senior Full-Stack Developer and SaaS Architect.

Initialize a new Next.js 15 project for CreativeDox — a business software and automation company website.

Setup requirements:
- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion
- Lucide React icons
- ESLint + Prettier configured
- Path aliases (@/ for src)

Create the complete folder structure:
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── fonts/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   └── shared/
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── types.ts
├── hooks/
├── data/
│   ├── solutions.ts
│   ├── products.ts
│   ├── testimonials.ts
│   └── navigation.ts
└── styles/

Install all dependencies and configure:
- Tailwind with custom theme (dark-first SaaS design)
- Framer Motion setup
- Inter font from next/font
- Base CSS variables for the design system

Design tokens to implement:
- Background: #09090B
- Foreground: #FAFAFA
- Card: #111113
- Border: #27272A
- Primary: #3B82F6
- Secondary: #8B5CF6
- Muted: #71717A

Create a working project that runs without errors.
Give me every file with complete code.
```

---

## Prompt 2 — Design System & UI Components

```
Now create the complete design system and reusable UI components for CreativeDox.

Read the existing project structure and build:

### 1. UI Components (src/components/ui/)

**Button.tsx**
- Variants: primary, secondary, ghost, accent (gradient)
- Sizes: sm, md, lg
- With icon support (left/right)
- Framer Motion hover and tap animations
- Primary = blue filled, Secondary = outline, Ghost = text only, Accent = gradient
- Shimmer/shine effect on hover for primary buttons (a light sweep across the button)

**Badge.tsx**
- Variants: default, primary, success, warning
- Small pill-shaped labels
- Animated border gradient option for "featured" badges
- Subtle glow effect

**Card.tsx**
- Variants: default, hover-lift, glow-border, spotlight (mouse-tracking gradient glow)
- Dark card background (#111113)
- 1px border (#27272A)
- Border radius 12px
- Hover effect: slight lift + border glow
- Spotlight variant: radial gradient follows mouse position inside card

**SectionHeading.tsx**
- Props: badge text, heading, subheading, alignment
- Badge on top (small pill with animated gradient border)
- Large heading (display-lg size)
- Muted subheading below
- Centered or left aligned option
- Text reveal animation built-in (words fade in one by one)

**AnimatedCounter.tsx**
- Counts from 0 to target number on scroll
- Uses Framer Motion useInView
- Suffix support (+ , % , K, M)
- Triggers only once
- Easing: ease-out for natural deceleration
- Optional glow effect on the number

**Container.tsx**
- Max width 1280px
- Centered with responsive padding
- Used as wrapper for all sections

**GradientText.tsx**
- Applies animated gradient to text (blue to purple, slowly shifting)

**SpotlightCard.tsx**
- Card component where a radial light gradient follows the mouse cursor
- Creates a premium "spotlight" effect like Linear.app
- The glow should be primary blue color, very subtle

**AnimatedBeam.tsx**
- SVG animated beam/line between two elements
- Used for connection visualizations
- Glowing particle travels along the path

**Particles.tsx**
- Lightweight floating particle background
- Small dots that drift slowly
- Very subtle, low opacity
- Used as background decoration

**MarqueeRow.tsx**
- Infinite horizontal scrolling row
- Used for logos, tech stack, integrations
- Smooth CSS animation (no JS for performance)
- Pause on hover

**MagneticButton.tsx**
- Button that subtly moves toward the cursor when nearby
- Premium micro-interaction
- Used for primary CTAs

### 2. Animation Utilities (src/lib/animations.ts)

Create reusable Framer Motion variants:
- fadeInUp (for scroll reveals)
- fadeInDown
- fadeInLeft / fadeInRight
- staggerContainer (for grids)
- staggerItem (for grid children)
- scaleOnHover (for cards)
- slideInLeft / slideInRight
- drawLine (for SVG path animations)
- textReveal (word-by-word reveal)
- blurIn (starts blurred, becomes clear)
- springScale (bouncy scale entrance)
- floatingAnimation (continuous gentle Y-axis float)
- pulseGlow (pulsing opacity animation for glows)
- typewriter (character-by-character reveal)

All animations should use cubic-bezier(0.16, 1, 0.3, 1) easing.

### 3. Custom Hooks (src/hooks/)

**useMousePosition.ts** — track mouse position for spotlight effects
**useScrollProgress.ts** — track scroll progress of the page (0-1)
**useSectionInView.ts** — detect when a section enters viewport
**useMediaQuery.ts** — responsive breakpoint detection
**useReducedMotion.ts** — respect prefers-reduced-motion accessibility setting

### 4. Utility Functions (src/lib/utils.ts)
- cn() function for conditional classnames (clsx + twMerge)

Make every component fully typed with TypeScript.
Make every component production-ready with clean code.
Give me complete code for every file.
```

---

## Prompt 3 — Data Layer

```
Create the complete data layer for CreativeDox website.

### 1. src/data/solutions.ts

Export an array of all solutions with:
- id (slug)
- title
- shortDescription (1 line)
- longDescription (2-3 lines)
- icon (Lucide icon name as string)
- features (array of 6-8 features)
- href (link to solution page)
- color (accent color for the card)
- gradient (two-color gradient for backgrounds)

Solutions to include:
1. Attendance Management — Employee attendance, leave, payroll integration
2. CRM Software — Lead management, customer tracking, deal pipeline
3. Accounting & Inventory — GST billing, stock management, financial reports
4. WhatsApp Automation — Bulk messaging, campaigns, customer engagement
5. Marketing Automation — Multi-channel campaigns, lead scoring, analytics
6. Cable TV Management — Subscriber management, billing, collection tracking
7. School Management — Attendance, fees, exams, parent portal
8. ERP Solutions — End-to-end business operations management
9. Lead Management — Capture, track, nurture, and convert leads
10. Custom Development — Tailor-made software for unique business needs

### 2. src/data/products.ts

Export product details for showcase section:
- id, name, tagline, description
- features (4 key features)
- pricing (starting price string)
- demoUrl, loginUrl, buyUrl
- screenshot (placeholder path)
- badge (e.g., "Popular", "New")
- gradient (unique gradient per product)

### 3. src/data/industries.ts

Export industries array:
- Retail & Shops
- Schools & Education
- Cable TV Operators
- Manufacturing
- Agencies
- Service Providers
- Startups

Each with: id, name, icon, description, relevantSolutions (array of solution ids), gradient

### 4. src/data/testimonials.ts

Export 6 testimonials with:
- id, quote, name, role, company, industry, rating (5), avatar (initials for placeholder)
- Each from a different industry

### 5. src/data/navigation.ts

Export complete navigation structure:
- Main nav items with dropdowns
- Footer nav columns
- CTA buttons config

### 6. src/data/stats.ts

Export statistics:
- 500+ Businesses Served
- 50,000+ Active Users
- 200+ Projects Delivered
- 1,000,000+ Automations Running

### 7. src/data/process.ts

Export the 4-step process:
- Understand Business → Design Solution → Automate Operations → Scale Growth
- Each step has: icon, title, description, color

### 8. src/data/advantages.ts

Export 6 advantage cards for "Why Choose CreativeDox"

### 9. src/data/logos.ts

Export array of tech/integration partner logos (text-based, for marquee):
- Google, WhatsApp, Razorpay, Tally, AWS, Twilio, Meta, Stripe, etc.

### 10. src/lib/types.ts

Create TypeScript interfaces for all data structures.

All data should be realistic, professional, and business-focused.
Give me complete code for every file.
```

---

# PHASE 2: Layout Components

---

## Prompt 4 — Navbar

```
Create a premium SaaS navigation bar for CreativeDox.

Read the existing project files and data/navigation.ts.

Build src/components/layout/Navbar.tsx:

Requirements:
- Fixed/sticky at top with z-50
- Transparent background on hero, solid dark (#09090B/95 with backdrop-blur-xl) on scroll
- Smooth transition between states (300ms)
- Logo on left: "Creative" in white + "Dox" in gradient text (blue to purple)

Desktop Navigation:
- Solutions — Mega dropdown with 2-column grid showing all 10 solutions with icons + short descriptions
- Services — Dropdown with 6 service items
- Industries — Dropdown with 7 industry items
- Pricing — Direct link
- Case Studies — Direct link
- Resources — Dropdown (Blog, Guides, FAQs)

Right side:
- "Book Consultation" — Primary button (blue) with subtle shimmer on hover
- "Login" — Ghost/outline button

Dropdown behavior:
- Opens on hover (desktop)
- Smooth Framer Motion animation (fade + slide down + scale from 0.95)
- Closes on mouse leave with slight delay (300ms)
- Semi-transparent backdrop overlay when dropdown open
- Each dropdown item has icon, title, and description
- Hover effect on dropdown items: subtle left border highlight + background shift

Mobile Navigation:
- Hamburger icon (animated open/close with smooth morph)
- Full-screen overlay menu with backdrop blur
- Accordion expandable sections for Solutions, Services, Industries, Resources
- Smooth height animations for accordion
- Sticky bottom bar: "Book Consultation" + "Login" buttons
- Staggered item entrance animation

Animations:
- Scroll state change: smooth opacity and background transition
- Dropdown: fadeInUp with stagger for items (50ms between items)
- Mobile menu: slide from right with backdrop blur fade
- Hamburger: smooth morph to X
- Active nav item: animated underline

Also create src/components/layout/Footer.tsx:
- 4 column layout: Solutions, Company, Resources, Contact
- Bottom bar: copyright, legal links
- Social links: LinkedIn, Twitter, YouTube, Instagram (with hover color effects)
- WhatsApp floating button (fixed bottom-right on all pages)
- Dark background (#09090B), subtle top border with gradient (blue to purple)
- Newsletter subscribe input with email field + button
- Link hover: subtle color transition + underline animation

Make it pixel-perfect, production-ready, fully responsive.
Give me complete code.
```

---

## Prompt 5 — Root Layout

```
Now create the root layout that wraps the entire CreativeDox website.

Update src/app/layout.tsx:
- Import Inter font from next/font/google
- Import global CSS
- Add Navbar and Footer
- Set metadata: title, description, Open Graph, Twitter cards
- Add a WhatsApp floating button component
- Smooth scroll behavior
- Dark theme as default

Create src/components/shared/WhatsAppButton.tsx:
- Fixed bottom-right corner
- WhatsApp green icon (#25D366)
- Continuous gentle pulse/glow animation (ring effect expanding outward)
- Tooltip on hover: "Chat with us"
- On click: opens WhatsApp with pre-filled message "Hi, I'm interested in CreativeDox solutions. Can you help?"
- Phone number: placeholder (will be replaced)
- Hide when scrolled to footer (optional)
- Responsive: slightly smaller on mobile
- Entry animation: scale up with bounce on page load (delayed 2s)

Create src/components/shared/SmoothScrollProvider.tsx:
- Wraps the app for smooth scroll behavior
- Handles anchor link smooth scrolling

Create src/components/layout/ScrollToTop.tsx:
- Appears after scrolling 500px
- Smooth scroll to top on click
- Fade in/out + slide up animation
- Circular button with arrow-up icon
- Subtle backdrop blur

Create src/components/shared/PageTransition.tsx:
- Framer Motion AnimatePresence wrapper
- Fade + slight slide transition between pages
- Smooth and fast (300ms)

Create src/components/shared/CursorGlow.tsx:
- A subtle radial gradient that follows the mouse cursor on the page
- Very low opacity (0.03-0.05)
- Large radius (400-600px)
- Blue/purple color
- Only on desktop (disable on mobile/touch devices)
- This creates a premium ambient lighting effect like Linear.app

Update src/app/globals.css:
- Smooth scrolling (scroll-behavior: smooth)
- Custom scrollbar styling (thin, dark with primary color thumb)
- Selection color (primary blue background, white text)
- Base body styles
- Noise texture overlay (very subtle, via CSS)
- Grid pattern background (very faint, for hero sections)
- Gradient keyframe animations
- Shimmer animation keyframes

Also create src/app/page.tsx as the homepage shell:

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      {/* TrustBar */}
      {/* LogoMarquee */}
      {/* Solutions */}
      {/* Industries */}
      {/* Process */}
      {/* ProductShowcase */}
      {/* WhyChooseUs */}
      {/* Testimonials */}
      {/* Stats */}
      {/* FinalCTA */}
    </main>
  );
}

Give me complete code for all files.
```

---

# PHASE 3: Homepage Sections (ENHANCED — Premium Animated)

---

## Prompt 6 — Hero Section (CINEMATIC)

```
Create a CINEMATIC, visually stunning Hero Section for CreativeDox homepage.

This is the most important section of the entire website. It must look world-class — like Linear, Stripe, or Vercel's hero section.

Read existing project code and build src/components/sections/Hero.tsx

### Layout:
- Full viewport height (100vh) minimum
- Centered content layout (text center on desktop)
- Animated background behind everything
- Content stacked vertically: badge → headline → subheadline → buttons → trust line

### Background Effects (CRITICAL — this makes it premium):

Layer 1 — Base:
- Deep dark gradient background (#09090B to #0A0A12)

Layer 2 — Grid Pattern:
- Subtle CSS grid/dot pattern across the entire section
- Very low opacity (0.03-0.05)
- Grid lines in #27272A
- Fades out toward edges using CSS mask (radial-gradient)

Layer 3 — Gradient Orbs:
- 2-3 large blurred gradient circles floating in the background
- Orb 1: Blue (#3B82F6), positioned top-right, 600px diameter, blur 150px, opacity 0.15
- Orb 2: Purple (#8B5CF6), positioned bottom-left, 500px diameter, blur 120px, opacity 0.12
- Orb 3: Cyan (#06B6D4), positioned center-bottom, 400px diameter, blur 100px, opacity 0.08
- Each orb has slow floating animation (different speeds, 15-25 second loops)
- Use CSS or Framer Motion for animation

Layer 4 — Particle Field:
- 30-50 small dots scattered across the hero
- Very small (2-3px), low opacity (0.2-0.4)
- Slow random drift animation
- Creates depth and life
- Use CSS animation or lightweight canvas (NOT heavy libraries)

Layer 5 — Animated Beams/Lines:
- 2-3 subtle glowing lines that animate across the background
- Like shooting stars but horizontal/diagonal
- Very subtle, thin, with fade trail
- Adds movement without distraction

### Content:

**Badge (top):**
- Pill shape with animated gradient border (border rotates continuously)
- Text: "🚀 Business Software & Automation Platform"
- Small, subtle glow
- Entrance: fade + scale from 0.8

**Headline:**
- Text: "Transform Your Business With"
- Second line: "Smart Software & Automation"
- The words "Smart Software & Automation" have animated gradient text (blue → purple → cyan, shifting)
- Font: 56-72px, weight 800, letter-spacing -0.03em
- Each word fades in sequentially (staggered by 80ms)
- Max width: 900px, centered
- Text shadow: subtle dark shadow for depth

**Subheadline:**
- Text: "CRM, Accounting, Attendance, WhatsApp Automation, Marketing Tools — ready-to-use cloud software and custom development for growing businesses."
- Color: #A1A1AA (muted)
- Font: 18-20px, weight 400
- Max width: 640px, centered
- Entrance: fade in 300ms after headline completes
- Line height: 1.6

**CTA Buttons (centered row):**
- "Explore Solutions" — Primary button:
  - Blue gradient background
  - Arrow-right icon
  - Shimmer/shine sweep animation on hover (light moves left to right)
  - Scale up slightly on hover (1.02)
  - Magnetic button effect (moves slightly toward cursor)
- "Book Free Consultation" — Secondary button:
  - Transparent with border
  - Calendar icon
  - Border glow on hover
  - Background fills slightly on hover
- Both buttons: entrance = fade + slide up, staggered

**Trust Line (below buttons):**
- "Trusted by 500+ businesses across India"
- Small text, muted color
- Animated underline or small decorative dots
- Entrance: fade in last

### Animated Visualization (below or integrated):

Create an ANIMATED NETWORK DIAGRAM showing CreativeDox's connected ecosystem:

- Central node: CreativeDox logo/icon (larger, prominent, glowing)
- 7 surrounding nodes arranged in a circular/orbital pattern:
  1. CRM (Users icon)
  2. WhatsApp (MessageCircle icon)
  3. Accounting (Calculator icon)
  4. Attendance (Clock icon)
  5. Marketing (TrendingUp icon)
  6. Reports (BarChart icon)
  7. Analytics (PieChart icon)

- Each node:
  - Small dark card with icon and label
  - Subtle glow in its accent color
  - Connected to center with an animated line/beam
  - Floating animation (each at different speed/offset)

- Connection lines:
  - Thin lines connecting each node to center
  - Animated glowing dot/particle traveling along each line (different speeds)
  - Lines are SVG paths with stroke-dasharray animation
  - Creates a "data flowing" visualization

- The entire visualization:
  - Slowly rotates (very subtle, 60-second full rotation)
  - Responsive: smaller on tablet, hidden or simplified on mobile
  - On mobile: show a simplified version OR just the gradient orbs without the network

### Scroll Indicator:
- At bottom of hero
- Animated bouncing arrow/chevron pointing down
- "Scroll to explore" text (very small, muted)
- Fades out as user starts scrolling

### Performance Notes:
- Use CSS animations where possible (not JS) for background effects
- Particles should be CSS-only or very lightweight
- Reduce/disable animations on mobile
- Use will-change: transform on animated elements
- Respect prefers-reduced-motion
- Lazy-load the network visualization

Give me COMPLETE, production-ready code. This section must look STUNNING.
```

---

## Prompt 7 — Trust Bar + Logo Marquee + Solutions Section

```
Create three homepage sections for CreativeDox:

Read existing project code.

### Section 1: TrustBar (src/components/sections/TrustBar.tsx)

A compact, premium strip of animated metrics.

Layout:
- Full width
- Background: slightly elevated dark (#0C0C0F) with glass-morphism effect
- Thin gradient border on top and bottom (blue → purple, 1px)
- Padding: 32px vertical

Content — 5 animated counters in horizontal row:

| Icon | Number | Label |
|------|--------|-------|
| Building2 | 500+ | Businesses Served |
| Package | 10+ | Software Products |
| Users | 50,000+ | Active Users |
| Shield | 99.9% | Uptime Guarantee |
| Headphones | 24/7 | Support Available |

Each counter:
- Lucide icon (24px, primary blue color) on top
- Large number below (32-36px, white, bold)
- Label below number (14px, muted)
- Thin vertical divider line between counters
- Glass card background per counter (optional)

Animation:
- Numbers count up from 0 when section enters viewport
- Count duration: 2.5 seconds with ease-out deceleration
- Triggers only once (useInView with once: true)
- Staggered start: 200ms delay between each counter
- Each counter has a subtle glow pulse when it finishes counting
- The number should "land" with a very subtle scale bounce (1.05 → 1.0)

Mobile: 2x2 grid + 1 centered below, or horizontal scroll

---

### Section 2: LogoMarquee (src/components/sections/LogoMarquee.tsx)

Infinite scrolling logo strip showing technology/integration partners.

Layout:
- Full width, no max-width constraint
- Background: same as main bg
- Heading above (small): "Powering businesses with trusted technologies"
- Heading is muted, small (14px), centered, uppercase, letter-spacing: 0.1em

Marquee Content:
- Two rows scrolling in OPPOSITE directions (top row: left, bottom row: right)
- Each row contains 12-15 tech/partner logos
- Logos are TEXT-BASED (no image files needed):
  Google Cloud, AWS, WhatsApp Business, Razorpay, Meta, Tally, Twilio, Stripe, MongoDB, React, Node.js, PostgreSQL, Redis, Vercel, DigitalOcean

Each logo:
- Text rendered in the brand's style
- Muted color (#52525B) by default
- Brighten on hover (#A1A1AA)
- Inside a subtle bordered pill/card

Animation:
- Pure CSS infinite scroll (translateX animation)
- Smooth, no jank
- Speed: ~30 seconds per full cycle
- Pauses on hover
- Seamless loop (duplicate items for infinite effect)
- Fades at edges (CSS mask: linear-gradient to transparent)

---

### Section 3: Solutions Grid (src/components/sections/Solutions.tsx)

Premium interactive solutions grid.

Layout:
- Section padding: 120px top, 96px bottom
- SectionHeading:
  - Badge: "Our Solutions" (animated gradient border pill)
  - Heading: "Software Solutions for Every Business Need" — word-by-word reveal animation
  - Subheading: "From attendance tracking to full business automation — we have the tools to streamline your operations."

Grid:
- 3x3 grid on desktop (gap: 20px)
- 2 columns tablet
- 1 column mobile (but cards are wider, more horizontal layout)
- 10th card spans full width bottom or is a special "Custom Development" highlight card

Each Solution Card (PREMIUM DESIGN):
- Background: #111113 with subtle noise texture
- Border: 1px solid #1E1E22
- Border radius: 16px
- Padding: 28px

- Top-left: Icon container
  - 48px rounded-xl container
  - Background: solution's unique color at 10% opacity
  - Icon in solution's color
  - Subtle glow matching the solution color

- Title: 20px, white, semibold
- Description: 14px, muted (#71717A), 2 lines max
- Bottom: "Learn More →" link in primary blue

- **SPOTLIGHT HOVER EFFECT:**
  - When mouse enters card, a radial gradient spotlight follows the cursor inside the card
  - Gradient: solution's accent color at 5-8% opacity
  - Creates a premium "lighting" effect
  - Border color transitions to solution's accent color at 30% opacity
  - Card lifts 4px (translateY)
  - Arrow on "Learn More" slides right 4px
  - Transition: 200ms ease-out

Animation:
- Cards enter with staggered fadeInUp
- 80ms delay between cards
- Start when section enters viewport
- Duration: 500ms each
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

Below grid:
- Centered text: "Not sure which solution fits your business?"
- CTA Button: "Get Free Consultation →" with shimmer effect

Give me complete code for ALL three sections.
```

---

## Prompt 8 — Industries + Process (ANIMATED TIMELINE)

```
Create two visually rich homepage sections for CreativeDox:

Read existing project code.

### Section 1: Industries (src/components/sections/Industries.tsx)

Layout:
- Section padding: 120px vertical
- Background: subtle gradient shift (#09090B → #0B0B10 → #09090B)
- SectionHeading:
  - Badge: "Industries" (gradient border pill)
  - Heading: "Built for Your Industry" — reveal animation
  - Subheading: "Solutions designed with your industry's unique challenges in mind."

Content — BENTO GRID LAYOUT (not a boring uniform grid):
- Inspired by Apple/Linear bento grids
- Mixed card sizes:
  - 2 large cards (span 2 columns)
  - 3 medium cards (span 1 column)
  - 2 small cards (span 1 column)

Industry Cards:
1. Retail & Shops (LARGE) — "Billing, inventory, and customer management"
2. Schools & Education (LARGE) — "Attendance, fees, exams, and parent communication"
3. Cable TV Operators (MEDIUM) — "Subscriber management and collection tracking"
4. Manufacturing (MEDIUM) — "Order tracking, production, and inventory"
5. Agencies (MEDIUM) — "CRM, automation, and client management"
6. Service Providers (SMALL) — "Scheduling, invoicing, and customer follow-up"
7. Startups (SMALL) — "MVP development and rapid scaling"

Each card:
- Dark background (#111113)
- Industry icon (48px) with unique color
- Title (heading-md, white)
- Description (body-sm, muted)
- "Explore Solutions →" link
- Unique subtle gradient background per industry (very faint, 3-5% opacity)
- Bottom: small tags showing relevant products (e.g., "CRM", "Accounting" as tiny pills)

Card Effects:
- Spotlight/mouse-follow glow effect on hover
- Border glow in industry accent color on hover
- Cards lift 4px on hover
- Staggered entrance animation

Large cards:
- Can include a mini illustration or abstract SVG pattern
- More prominent gradient background
- Larger icon and text

Mobile: Stack all cards as single column, equal height

---

### Section 2: Process (src/components/sections/Process.tsx)

SCROLL-DRIVEN ANIMATED TIMELINE — this is a showpiece section.

Layout:
- Full section height: auto (expands based on content)
- Background: dark with a very subtle vertical gradient line in the center
- SectionHeading:
  - Badge: "How It Works"
  - Heading: "From Chaos to Clarity in 4 Steps"
  - Subheading: "We don't just sell software. We partner with you to transform your operations."

### Desktop Layout — Horizontal Animated Timeline:

Structure:
- Horizontal line across the center of the section
- 4 step nodes positioned along the line
- Alternating: Step 1 (above line), Step 2 (below), Step 3 (above), Step 4 (below)

The Line:
- SVG path, initially gray (#27272A)
- As user scrolls, the line FILLS with a gradient (blue → purple) from left to right
- Use Framer Motion useScroll + useTransform to track scroll progress of this section
- The fill follows scroll progress smoothly

Step Nodes:
- Circular nodes (64px) on the line
- Initially: gray border, empty
- When the gradient line reaches the node: 
  - Node fills with gradient color
  - Checkmark or step number appears
  - Glow effect activates
  - Content card fades in

Each Step Content Card:
- Positioned above or below the node (alternating)
- Connected to node with a thin line
- Card content:
  - Step number badge: "01", "02", "03", "04" (large, gradient text)
  - Icon (40px, in colored circle)
  - Title (heading-md, white, bold)
  - Description (body-sm, muted, 2 lines)
- Card has glass-morphism effect (backdrop-blur, semi-transparent)
- Subtle border

Steps:
1. Icon: Search | "Understand Your Business" | "We study your current processes, pain points, and goals through a free consultation."
2. Icon: PenTool | "Design the Right Solution" | "We recommend the perfect combination of products and customizations for your needs."
3. Icon: Zap | "Automate Operations" | "We deploy, configure, and train your team so you're productive from day one."
4. Icon: TrendingUp | "Scale Your Growth" | "With data-driven insights and automation, watch your business grow faster."

### Mobile Layout — Vertical Timeline:
- Vertical line on the left side
- Steps stacked vertically
- Same scroll-driven fill animation but vertical
- Each step card to the right of the line

### Animation Details:
- Use Framer Motion useScroll with target ref on the section
- scrollYProgress mapped to the line's pathLength or gradient position
- Each step triggers at 25%, 50%, 75%, 100% of section scroll
- Content cards: fadeInUp + opacity transition when their step activates
- Numbers: count from 0 to final digit with blur-in effect

CTA below timeline:
- "Start Your Transformation Today"
- Button: "Book Free Consultation" (primary, large, shimmer)

Give me complete, production-ready code for BOTH sections.
```

---

## Prompt 9 — Product Showcase (PREMIUM CAROUSEL)

```
Create a PREMIUM Product Showcase section for CreativeDox homepage.

Read existing project code and data/products.ts.

Build src/components/sections/ProductShowcase.tsx

This section should feel like a premium product gallery — think Apple product showcase meets Stripe's product cards.

### Layout:
- Section padding: 120px vertical
- Background: slight gradient (#09090B → #0D0D12 → #09090B)
- SectionHeading:
  - Badge: "Our Products" (gradient border)
  - Heading: "Ready-to-Use Business Software"
  - Subheading: "Start using any product today. No setup complexity. No long contracts."

### Product Carousel:

Type: Full-width horizontal carousel with 3D perspective feel

Desktop:
- Show 3 cards at a time
- Center card is LARGER and elevated (scale: 1.05, higher z-index)
- Side cards are slightly dimmed and smaller (scale: 0.95, opacity: 0.7)
- Smooth transition between slides
- Left/right navigation arrows (circular buttons, glass-morphism)
- Dot indicators below

Mobile:
- Single card view
- Swipe/touch support
- Snap scrolling

### Each Product Card (PREMIUM DESIGN):

Size: Min-width 400px (desktop), full-width (mobile)

Structure:
1. **Screenshot Area (top 50%):**
   - Dark browser frame mockup (dots for close/minimize/maximize)
   - Inside: product-specific gradient background representing a dashboard
   - Create unique abstract gradient per product:
     - Attendance: Blue tones
     - CRM: Green tones
     - Accounting: Amber tones
     - WhatsApp: Green (#25D366) tones
     - Marketing: Purple tones
     - Cable TV: Cyan tones
     - School: Indigo tones
     - ERP: Rose tones
   - Floating UI element mockups inside (fake chart, fake table rows, fake stats)
   - Subtle parallax effect: screenshot content moves slightly on card hover
   - Overflow hidden with rounded top corners

2. **Badge:** (top-right of screenshot area)
   - "Popular", "New", or "Best Value"
   - Pill with colored background
   - Only on select products

3. **Product Name:** (heading-md, white, bold)

4. **Tagline:** (body-sm, muted, 1 line)

5. **Features:** (4 items)
   - Small check icon (green) + feature text
   - Compact list
   - 14px, muted text

6. **Pricing:**
   - "Starting at" (small, muted)
   - "₹XXX/month" (24px, white, bold)
   - Price should have a quick count-up animation when card enters center position

7. **Action Buttons (row of 3):**
   - "Get Demo" — Primary blue button (small)
   - "Login" — Ghost button (small)
   - "Buy Now" — Accent gradient button (small)

Card Styling:
- Background: #111113
- Border: 1px solid #1E1E22
- Border radius: 20px (top for screenshot, overall for card)
- No card padding top (screenshot bleeds to edge)
- 24px padding on sides and bottom
- Hover (when card is in center): 
  - Entire card has a subtle outer glow (primary blue, 10% opacity)
  - Screenshot area has subtle shine sweep animation
  - Border brightens slightly

### Carousel Controls:

Navigation Arrows:
- Circular buttons (48px)
- Glass-morphism: backdrop-blur + semi-transparent background
- Left/right chevron icons
- Positioned at vertical center of carousel
- Hide if at start/end (or loop infinitely)
- Hover: background brightens, subtle scale (1.05)

Dot Indicators:
- Small dots below carousel
- Active dot: primary blue, wider (pill shape)
- Inactive: gray, circular
- Smooth transition between states

Auto-play:
- Auto-advance every 5 seconds
- Pause on hover
- Smooth transition (500ms)
- Reset timer on manual navigation

### Animation:
- Section entrance: heading first, then carousel fades in
- Cards slide horizontally with spring physics
- Center card scales up, side cards scale down
- Transition: 600ms with spring easing
- On scroll enter: first card arrangement animates from stacked to spread

### CTA below carousel:
- "See All Products & Compare Plans →"
- Underline animation on hover

Products to display (from data):
1. CreativeDox Attendance — ₹499/month — "Popular"
2. CreativeDox CRM — ₹699/month — "Best Value"
3. CreativeDox Accounting — ₹599/month
4. CreativeDox WhatsApp — ₹999/month — "New"
5. CreativeDox Marketing — ₹799/month
6. CreativeDox Cable TV — ₹599/month
7. CreativeDox School — ₹899/month
8. CreativeDox ERP — ₹1,499/month

Give me COMPLETE, production-ready code.
```

---

## Prompt 10 — Why Choose Us + Testimonials (PREMIUM)

```
Create two premium homepage sections for CreativeDox:

Read existing project code.

### Section 1: WhyChooseUs (src/components/sections/WhyChooseUs.tsx)

Layout:
- Section padding: 120px vertical
- Two-column layout on desktop:
  - Left (40%): Sticky heading content
  - Right (60%): Advantage cards grid
- Mobile: heading on top, cards below

Left Column (Sticky):
- Badge: "Why CreativeDox" (gradient border)
- Heading: "Why 500+ Businesses Choose CreativeDox" — each word fades in
- Subheading paragraph: "We combine enterprise-grade software with startup-friendly pricing and dedicated human support."
- Below text: A large animated number "500+" with glow effect
- The heading stays sticky as user scrolls through the cards

Right Column — 2x3 Grid of Cards:

Cards (from data/advantages.ts):
1. Icon: Target | "Business-Focused Design" | "Every feature solves a real business problem, not just demo fluff."
2. Icon: IndianRupee | "Affordable Pricing" | "Enterprise features at startup-friendly prices. No hidden costs."
3. Icon: Headphones | "Dedicated Support" | "Real humans on WhatsApp, phone, email. Avg response: under 2 hours."
4. Icon: Palette | "Fully Customizable" | "Start with a ready product. Customize as your business grows."
5. Icon: Cloud | "Cloud-First Platform" | "Access from anywhere. Auto backups. 99.9% uptime guaranteed."
6. Icon: Shield | "Secure Infrastructure" | "Bank-grade encryption, security audits, complete data privacy."

Each Card:
- Background: #111113
- Border: 1px solid #1E1E22
- Border radius: 16px
- Padding: 28px
- Icon: 44px container with colored background (10% opacity) + icon in accent color
- Title: 18px, white, semibold
- Description: 14px, muted
- SPOTLIGHT EFFECT: mouse-following radial gradient glow inside card
- Hover: card lifts 4px, border color shifts to accent, icon container glows
- Each card has a unique subtle accent color

Animation:
- Left column fades in first
- Cards enter with staggered fadeInUp from the right
- 100ms stagger between cards
- Icon containers have a subtle pulse on entrance
- Sticky behavior on left column (position: sticky, top: 120px)

---

### Section 2: Testimonials (src/components/sections/Testimonials.tsx)

PREMIUM TESTIMONIAL CAROUSEL — not just a basic slider.

Layout:
- Section padding: 120px vertical
- Background: subtle gradient (#09090B → #0B0B14 → #09090B)
- SectionHeading:
  - Badge: "Testimonials"
  - Heading: "What Business Owners Say"
  - Subheading: "Real stories from real businesses that transformed with CreativeDox."

### Carousel Design (STACKED CARD STYLE):

Instead of simple horizontal slides, use a STACKED/DECK style:
- Active testimonial card in center, fully visible
- Previous/next cards visible behind it (peeking from sides), slightly rotated and scaled down
- Creates a 3D card deck effect

Or alternatively, a LARGE CENTER CARD style:
- One large testimonial in the center
- Smaller preview cards on left and right (partially visible, dimmed)
- Click on side cards to navigate

Each Testimonial Card:
- Max-width: 700px, centered
- Background: gradient from #111113 to #161620
- Border: 1px solid #1E1E22 with subtle gradient border (animated)
- Border radius: 24px
- Padding: 48px

Content:
1. Large decorative quote mark "❝" — 80px, gradient text (blue → purple), top-left
2. Quote text — 20px, white, font-weight 500, line-height 1.7
3. Star rating — 5 stars, filled yellow/amber (#F59E0B), animated fill on card enter
4. Horizontal divider — thin gradient line
5. Author section:
   - Avatar circle (48px): initials on gradient background (since no real photos)
   - Name: 16px, white, bold
   - Role + Company: 14px, muted
   - Industry badge: small pill (e.g., "Retail", "Education") with accent color

Testimonials (6, from data):
1. Retail shop owner — billing errors reduced by 80%
2. Cable TV operator — collection rate up 40%
3. School principal — attendance now takes 30 seconds
4. Agency owner — lead follow-up automated, 3x more conversions
5. Manufacturing — order tracking time cut by 60%
6. Startup founder — MVP delivered in 3 weeks

Navigation:
- Left/right arrows (glass-morphism circular buttons)
- Dot indicators
- Auto-advance every 6 seconds, pause on hover
- Keyboard arrow support

Animation:
- Card transition: 3D perspective rotation + scale + opacity
- Enter from right: rotateY(15deg), scale(0.9), opacity 0
- Active: rotateY(0), scale(1), opacity 1
- Exit left: rotateY(-15deg), scale(0.9), opacity 0
- Transition duration: 600ms with spring easing
- Stars fill in sequentially (50ms between each)
- Quote mark fades in with scale

Mobile:
- Single card view
- Swipe support
- No side previews (too small)
- Simpler transition (slide instead of 3D)

CTA below carousel:
- "Read More Success Stories →" link

Give me COMPLETE, production-ready code for BOTH sections.
```

---

## Prompt 11 — Stats + Final CTA (CINEMATIC)

```
Create the final two homepage sections for CreativeDox. These are the closing sections — they must leave a strong impression.

Read existing project code.

### Section 1: Stats (src/components/sections/Stats.tsx)

FULL-WIDTH IMPACT SECTION — pure visual power.

Layout:
- Full viewport width (break out of container)
- Height: auto but generous padding (100-120px vertical)
- Background: DRAMATIC gradient
  - Base: linear-gradient(135deg, #0C1220 0%, #09090B 50%, #120C20 100%)
  - Overlay: subtle noise texture
  - Animated gradient orbs behind the numbers (similar to hero but more subtle)
  - Grid pattern at very low opacity

Content — 4 MASSIVE animated counters in horizontal row:

| Icon | Number | Suffix | Label |
|------|--------|--------|-------|
| Building2 | 500 | + | Businesses Served |
| Users | 50,000 | + | Active Users |
| CheckCircle | 200 | + | Projects Delivered |
| Zap | 1,000,000 | + | Automations Running |

Each counter:
- Icon: 36px, inside a gradient circle (glass-morphism), unique color per stat
- Number: 56-64px, white, weight 800, letter-spacing -0.02em
- The number should have a subtle TEXT GLOW effect (text-shadow with primary color)
- Suffix (+): same size, gradient text
- Label: 16px, muted (#71717A)
- Thin glass card/container behind each counter (backdrop-blur, border)

Animation (IMPACTFUL):
- Numbers count up when section enters viewport
- Count duration: 3 seconds
- Easing: ease-out (starts fast, decelerates)
- For 1,000,000: show counting rapidly with comma formatting
- Each counter starts 300ms after the previous
- When counting finishes:
  - Number "lands" with a subtle scale pulse (1.08 → 1.0, 200ms)
  - Glow behind number intensifies briefly then fades to resting state
  - A ring/ripple effect expands outward from the number (like a pulse wave)
- Triggers only once

Between counters:
- Vertical divider lines (1px, gradient from transparent to #27272A to transparent)

Mobile:
- 2x2 grid
- Smaller numbers (40-48px)
- Same counting animation

---

### Section 2: FinalCTA (src/components/sections/FinalCTA.tsx)

THE GRAND FINALE — high-impact call to action.

Layout:
- Full width section
- Generous padding: 140-160px vertical
- Centered content, max-width 800px

Background (CINEMATIC):
- Deep gradient: #09090B → #0C1225 → #150C25 → #09090B (top to bottom)
- ANIMATED GRADIENT MESH:
  - 3-4 large, soft gradient blobs that slowly morph and move
  - Colors: blue (#3B82F6), purple (#8B5CF6), cyan (#06B6D4)
  - Very blurred (blur: 150-200px)
  - Low opacity (0.1-0.15)
  - Animation: slow drift + scale change (20-30 second loops)
  - Creates an aurora/northern-lights effect
- Grid pattern overlay (very subtle)
- Stars/particles: 20-30 small white dots with twinkle animation

Content:
1. **Badge:** "Get Started" — animated gradient border pill

2. **Headline:** "Ready to Digitize Your Business?"
   - 48-56px, white, weight 800
   - "Digitize" has animated gradient text (blue → purple, shifting)
   - Text enters with word-by-word reveal animation
   - Letter-spacing: -0.02em

3. **Subheadline:**
   - "Join 500+ businesses that have already transformed their operations with CreativeDox."
   - 18px, muted (#A1A1AA)
   - Max-width: 560px
   - Enters after headline

4. **CTA Buttons (centered row):**
   - "Schedule Free Consultation" — LARGE primary button
     - Blue gradient background
     - Calendar icon
     - Shimmer sweep animation on idle (repeating every 3 seconds)
     - Scale + glow on hover
     - Magnetic button effect
     - Size: large (px: 32px, py: 16px)
   - "Explore All Products" — LARGE secondary button
     - Outline style with gradient border
     - Arrow-right icon
     - Border glow on hover
     - Same size as primary

5. **WhatsApp Line:**
   - "Or chat with us directly on WhatsApp →"
   - WhatsApp icon (green) + text (muted)
   - Hover: text becomes white, icon pulses
   - Links to WhatsApp

6. **Decorative Elements:**
   - Small floating badges around the CTA area:
     - "Free Consultation" ↗ top-right
     - "14-Day Trial" ↗ top-left
     - "No Credit Card" ↗ bottom
   - These badges float gently and have glass-morphism style
   - Very subtle, don't distract from main CTA
   - Only on desktop

Animation:
- Entire section fades in on scroll
- Background gradient mesh starts animating when in view
- Content staggers: badge → headline → subheadline → buttons → WhatsApp line
- Floating badges drift independently
- CTA buttons have continuous subtle pulse (scale: 1.0 → 1.02, 2-second loop)

### BONUS — Create a pre-footer strip:

Before the actual footer, add a small strip:
- "Trusted by 500+ businesses • 10+ Products • 99.9% Uptime • 24/7 Support"
- Scrolling marquee style (infinite horizontal scroll)
- Very small text (12px), muted
- Subtle top border

Give me COMPLETE, production-ready code for BOTH sections + the pre-footer strip.
```

---

## Prompt 12 — Assemble Complete Homepage

```
Now assemble the COMPLETE CreativeDox homepage with all sections.

Read ALL existing components and sections created so far.

### Update src/app/page.tsx:

Import and render ALL homepage sections in this exact order:

1. Hero — id="hero"
2. TrustBar — id="trust"
3. LogoMarquee — (no id needed)
4. Solutions — id="solutions"
5. Industries — id="industries"
6. Process — id="process"
7. ProductShowcase — id="products"
8. WhyChooseUs — id="why-us"
9. Testimonials — id="testimonials"
10. Stats — id="stats"
11. FinalCTA — id="contact"
12. PreFooterStrip — (no id needed)

### Requirements:

1. **Section Spacing:**
   - Ensure proper spacing between sections (no overlapping, no awkward gaps)
   - Use CSS to add smooth transitions between section backgrounds
   - Sections with different backgrounds should blend smoothly

2. **Scroll Navigation:**
   - Update Navbar links to scroll to corresponding sections smoothly
   - "Solutions" → #solutions
   - "Products" → #products
   - Add scroll-margin-top: 80px to each section (to account for fixed navbar)

3. **Performance:**
   - Wrap below-fold sections in dynamic imports if needed:
     - Sections 7-12 can be dynamically imported
   - Ensure no hydration mismatches
   - Verify all Framer Motion animations work with SSR

4. **Intersection Observer:**
   - Create a hook or utility that tracks which section is currently in view
   - Update the active nav item based on current section
   - Smooth highlight transition in navbar

5. **Loading States:**
   - Add a brief page loading animation (logo pulse, then fade to content)
   - Or use Next.js loading.tsx with a skeleton

6. **Test Checklist — verify ALL of these:**
   - [ ] All 12 sections render without errors
   - [ ] No TypeScript errors or warnings
   - [ ] No console errors
   - [ ] All animations trigger correctly on scroll
   - [ ] Counter animations fire only once
   - [ ] Carousel navigation works (products + testimonials)
   - [ ] Mobile responsive on all sections
   - [ ] Navbar scroll detection works
   - [ ] WhatsApp button visible and functional
   - [ ] Footer renders with all links
   - [ ] CTA buttons have correct hover effects
   - [ ] Spotlight/glow effects work on cards
   - [ ] Background effects render without performance issues
   - [ ] No layout shift on page load
   - [ ] Smooth transitions between sections

7. **Fix any issues** found in existing section code:
   - Missing imports
   - Type errors
   - Animation conflicts
   - Responsive breakpoints
   - Z-index stacking issues

8. **Meta optimization:**
   - Page title: "CreativeDox — Business Software & Automation Solutions"
   - Meta description optimized
   - Viewport meta configured

Give me the COMPLETE updated files for:
- src/app/page.tsx
- Any files that need fixes
- Any new utility files needed

The homepage must be FLAWLESS — zero errors, pixel-perfect, buttery smooth animations.
```

---

# PHASE 4: Product Pages

---

## Prompt 13 — Product Page Template

```
Create a universal product page template for CreativeDox.

This template will be used for ALL software product pages (Attendance, CRM, Accounting, WhatsApp, Marketing, Cable TV, School, ERP).

### Create these files:

**1. src/app/solutions/[slug]/page.tsx**
- Dynamic route that reads slug parameter
- Fetches product data based on slug
- Renders all product page sections
- Generates metadata dynamically (title, description, OG tags)
- 404 if slug doesn't match any product
- generateStaticParams for static generation

**2. src/data/product-details.ts**
- Detailed data for EACH product including:
  - slug, name, tagline, heroDescription
  - painPoints (3-4 problems without the software)
  - features (6-9 features with icon, title, description)
  - modules (list of included modules)
  - screenshots (placeholder array)
  - benefits (before/after comparisons)
  - pricing (3 tiers: Starter, Professional, Enterprise)
  - faqs (8-10 questions and answers)
  - integrations (list of compatible tools)
  - relatedProducts (3 product slugs)

Create COMPLETE detailed data for ALL products:
1. attendance-management
2. crm-software
3. accounting-inventory
4. whatsapp-automation
5. marketing-automation
6. cable-tv-management
7. school-management
8. erp-solutions

**3. Product page sections (src/components/product/):**

- ProductHero.tsx — Split layout: text left, screenshot right. Badge, headline, description, 3 CTAs (Demo, Pricing, Login), trust line. Gradient orb background matching product color.
- PainPoints.tsx — "Still managing [X] manually?" — 3-4 pain point cards with red/warning accent
- ProductFeatures.tsx — 3x3 grid of feature cards with spotlight hover effect
- ProductScreenshots.tsx — Interactive screenshot carousel with captions and browser mockups
- ProductModules.tsx — Accordion or tab layout listing all modules with smooth expand animation
- ProductBenefits.tsx — Before/After comparison table with animated transition
- ProductPricing.tsx — 3-tier pricing cards with monthly/annual toggle, spotlight on recommended plan
- ProductFAQ.tsx — Expandable accordion FAQ with smooth height animation
- ProductIntegrations.tsx — Marquee/grid of compatible tool logos
- ProductCTA.tsx — "Ready to try [Product]?" with gradient background and demo + sales buttons
- RelatedProducts.tsx — 3 related product cards

Make every section reusable — driven by props from the data layer.
The template should work for ALL products by just changing the data.
Apply the same premium design system: spotlight cards, gradient accents, smooth Framer Motion animations.

Give me complete code for every file.
```

---

## Prompt 14 — Product Page Data: Attendance + CRM

```
I need COMPLETE, realistic, detailed data for the first 2 product pages.

Read existing product-details.ts structure.

### Product 1: Attendance Management Software

Create full data including:
- Hero: tagline, description emphasizing digital attendance + payroll integration
- 4 pain points of manual attendance
- 9 features: Digital Attendance, Leave Management, Shift Scheduling, Overtime Tracking, Payroll Integration, Mobile App, Biometric Integration, Reports & Analytics, Multi-branch Support
- 10 modules
- 5 before/after benefits
- 3 pricing tiers (₹499, ₹999, ₹1999/month)
- 10 FAQs with detailed answers
- Integrations: Tally, WhatsApp, Biometric devices, Payroll systems
- 3 related products

### Product 2: CRM Software

Create full data including:
- Hero: tagline, description emphasizing lead management + sales automation
- 4 pain points of no CRM
- 9 features: Lead Capture, Pipeline Management, Contact Management, Task Automation, Email Integration, WhatsApp Integration, Reports Dashboard, Team Management, Mobile CRM
- 10 modules
- 5 before/after benefits
- 3 pricing tiers (₹699, ₹1499, ₹2999/month)
- 10 FAQs with detailed answers
- Integrations: WhatsApp, Google Workspace, Social Media, Payment Gateways
- 3 related products

All content must be:
- Professional and business-focused
- Specific (not generic filler text)
- SEO-optimized (naturally includes target keywords)
- Written from the customer's perspective

Update src/data/product-details.ts with this data.
Give me complete code.
```

---

## Prompt 15 — Product Page Data: Remaining Products

```
Create COMPLETE detailed data for the remaining 6 product pages.

Read existing product-details.ts and follow the exact same structure.

### Product 3: Accounting & Inventory Software
- Focus: GST billing, stock management, invoicing, financial reports
- Pricing: ₹599, ₹1,299, ₹2,499/month

### Product 4: WhatsApp Automation Platform
- Focus: Bulk messaging, scheduled campaigns, chatbots, customer engagement
- Pricing: ₹999, ₹1,999, ₹3,999/month

### Product 5: Marketing Automation Platform
- Focus: Multi-channel campaigns, lead scoring, analytics, email marketing
- Pricing: ₹799, ₹1,699, ₹3,499/month

### Product 6: Cable TV Management Software
- Focus: Subscriber management, billing cycles, collection tracking, area reports
- Pricing: ₹599, ₹1,299, ₹2,499/month

### Product 7: School Management Software
- Focus: Attendance, fees, exams, parent portal, report cards
- Pricing: ₹899, ₹1,799, ₹3,499/month

### Product 8: ERP Solutions
- Focus: End-to-end business management, orders, production, finance
- Pricing: ₹1,499, ₹2,999, ₹5,999/month

For each product provide:
- Hero content (tagline + description)
- 4 pain points
- 9 features with icons and descriptions
- 10 modules
- 5 before/after benefits
- 3 pricing tiers with features per tier
- 10 FAQs with detailed answers
- Integration partners
- 3 related products

All content must be professional, specific, and business-focused.
Update src/data/product-details.ts with ALL data.
Give me complete code.
```

---

# PHASE 5: Supporting Pages

---

## Prompt 16 — Pricing Page

```
Create a comprehensive Pricing page for CreativeDox.

Build src/app/pricing/page.tsx

Layout:
- Hero section with heading: "Simple, Transparent Pricing"
- Subheading: "Choose the plan that fits your business. Upgrade anytime."
- Monthly/Annual toggle (annual shows 20% discount) with smooth slide animation

Pricing Table:
- Horizontal tabs for each product category
- Each tab shows 3 pricing cards (Starter, Professional, Enterprise)
- "Professional" card highlighted as "Most Popular" with gradient border and slight scale

Each pricing card:
- Tier name + price
- Monthly/annual toggle reflects instantly
- Feature checklist with check/cross icons
- CTA button
- Spotlight hover effect

Bottom section:
- "Need a Custom Plan?" card with gradient background
- CTA: "Talk to Our Team"

FAQ section with accordion.

Apply same animation patterns: fadeInUp, stagger, spotlight cards.
Give me complete code.
```

---

## Prompt 17 — About + Contact Pages

```
Create the About and Contact pages for CreativeDox.

### Page 1: About (src/app/about/page.tsx)

Sections:
1. Hero with animated headline
2. Our Story with animated timeline (Founded → Products → Growth)
3. Mission, Vision, Values cards (3 cards with spotlight effect)
4. What We Do — 3 pillars with icons
5. Stats reuse
6. CTA section

### Page 2: Contact (src/app/contact/page.tsx)

Sections:
1. Hero with heading
2. Two-column: Contact form (left) + Contact info (right)
3. Form: Name, Email, Phone, Business Name, Requirement dropdown, Message
4. Contact info: Email, Phone, WhatsApp, Address, Working Hours
5. Quick connect cards: Sales, Support, Partnership
6. Map embed placeholder

Both pages: responsive, animated, premium dark theme, SEO optimized.
Give me complete code.
```

---

## Prompt 18 — Book Consultation Page

```
Create the Book Consultation page for CreativeDox.

Build src/app/book-consultation/page.tsx

PRIMARY lead generation page. Maximum conversions.

Layout: Left (60%) = Multi-step form, Right (40%) = Trust content

### Multi-Step Form with progress bar:

Step 1 — Name, Phone, Email
Step 2 — Business Name, Business Type dropdown, Team Size
Step 3 — Requirements checkboxes (all products + "Not Sure"), description textarea
Step 4 — Preferred date, time slot, communication method

Each step: smooth Framer Motion slide transition, form validation, back button.

### Right side:
- "What Happens Next?" timeline (4 steps)
- "100% Free. No Obligations." badge
- "500+ businesses trust us" trust line
- Small testimonial quote

### Thank You State:
- Success checkmark animation
- Confirmation message
- "Add to Calendar" + "Explore Solutions" buttons

Form features: step animations, validation, loading state, error handling.
Premium design with gradient accents and glass-morphism cards.

Give me complete code.
```

---

# PHASE 6: Blog & SEO Pages

---

## Prompt 19 — Blog System

```
Create a blog system for CreativeDox.

### Files:
- src/app/blog/page.tsx — Blog listing with category filters
- src/app/blog/[slug]/page.tsx — Individual blog post
- src/data/blog-posts.ts — 6 sample blog posts with full content (500+ words each)
- src/components/blog/BlogCard.tsx — Card with hover effects
- src/components/blog/BlogHero.tsx — Post hero
- src/components/blog/BlogContent.tsx — Content renderer
- src/components/blog/BlogSidebar.tsx — Categories, recent posts, CTA

### Blog Listing:
- Hero heading + category filter tabs
- 3-column grid of blog cards
- Cards: thumbnail gradient, category badge, title, excerpt, author, date, read time
- Spotlight hover effect on cards

### Blog Post:
- Hero: title, category, author, date, read time
- Content with proper typography
- Sidebar: categories, recent posts, consultation CTA card
- Related posts at bottom
- Share buttons (WhatsApp, LinkedIn, Twitter)

### 6 Sample Posts:
1. "5 Signs Your Business Needs Automation Software"
2. "How to Choose the Right CRM for Your Small Business"
3. "Digital Attendance: Why Schools Are Making the Switch"
4. "WhatsApp Marketing: The Complete Guide for Indian Businesses"
5. "CreativeDox CRM 2.0: New Features and Improvements"
6. "Cable TV Billing Software: Solving the Collection Problem"

SEO: Dynamic metadata, OG tags, JSON-LD, breadcrumbs.
Premium dark theme design consistent with rest of site.

Give me complete code.
```

---

# PHASE 7: Final Polish

---

## Prompt 20 — Services Pages

```
Create the Services section pages for CreativeDox.

### Pages:
1. src/app/services/page.tsx — Overview with 6 service cards
2. src/app/services/custom-web-development/page.tsx
3. src/app/services/saas-development/page.tsx
4. src/app/services/business-automation/page.tsx
5. src/app/services/api-integration/page.tsx
6. src/app/services/ai-integration/page.tsx

### Each service page:
1. Hero with animated headline
2. What We Build — deliverable examples
3. Our Process — 4-6 steps
4. Technologies — tech stack icons
5. Case Study Snippet
6. Pricing Model — fixed/hourly/retainer
7. CTA: "Start Your Project"

Premium design, spotlight cards, gradient accents, Framer Motion animations.
Give me complete code.
```

---

## Prompt 21 — Industry Pages

```
Create industry landing pages for CreativeDox.

### Pages:
1. src/app/industries/page.tsx — Overview with bento grid
2. src/app/industries/retail/page.tsx
3. src/app/industries/schools-education/page.tsx
4. src/app/industries/cable-tv-operators/page.tsx
5. src/app/industries/manufacturing/page.tsx
6. src/app/industries/agencies/page.tsx
7. src/app/industries/service-providers/page.tsx
8. src/app/industries/startups/page.tsx

### Each page:
1. Hero — "Software Solutions for [Industry]"
2. Pain Points — 4-5 industry-specific problems
3. Our Solutions — relevant CreativeDox products
4. Workflow — industry-specific implementation
5. Results — improvement metrics
6. Testimonial — industry-specific
7. CTA — "Get Started"

Industry-specific language, SEO optimized, premium design.
Give me complete code.
```

---

## Prompt 22 — Legal Pages + Login Hub + 404

```
Create remaining pages:

### 1. Legal Pages (privacy-policy, terms-of-service, refund-policy)
- Standard SaaS legal content
- Clean typography, table of contents
- Professional formatting

### 2. Login Hub (/login)
- Grid of product cards with "Go to Login →" for each
- Search/filter
- Premium dark design

### 3. 404 Page
- Creative animated 404
- Gradient text + floating elements
- "Go Home" + "View Solutions" buttons

### 4. Loading Page
- Logo animation (pulse + fade)
- Minimal design

Give me complete code.
```

---

## Prompt 23 — SEO + Metadata + Performance

```
Optimize the entire CreativeDox website for SEO and performance.

### 1. Metadata — update layout.tsx with comprehensive defaults
### 2. Dynamic metadata for ALL pages (unique titles, descriptions, OG tags)
### 3. JSON-LD structured data (Organization, Product, FAQ, BlogPosting, BreadcrumbList)
### 4. Sitemap (src/app/sitemap.ts) — auto-generated
### 5. Robots.txt (src/app/robots.ts)
### 6. Performance:
   - Verify next/font usage
   - Dynamic imports for below-fold sections
   - Verify will-change on animations
   - Reduce motion for accessibility

Give me complete code.
```

---

## Prompt 24 — Final Review & Bug Fixes

```
Do a COMPLETE review of the entire CreativeDox website.

Go through EVERY file and:

### 1. Fix All Errors — TypeScript, imports, broken links, responsive issues, animation conflicts
### 2. Verify All Routes — homepage, 8 product pages, 6 service pages, 7 industry pages, pricing, about, contact, consultation, blog, login, legal pages, 404
### 3. Navigation — all navbar links, footer links, internal links, WhatsApp button
### 4. Mobile — stack layouts, readable text, tap-friendly buttons, working hamburger menu
### 5. Consistency — design system, colors, typography, animations, CTAs
### 6. Performance — no unnecessary re-renders, smooth animations, no layout shift
### 7. Animations — all scroll animations fire correctly, counters work, carousels work, spotlight effects work

Provide complete list of fixes and updated code.
```

---

# PHASE 8: Deployment

---

## Prompt 25 — Build & Deploy

```
Prepare CreativeDox for production deployment.

### 1. Environment Variables (.env.example)
### 2. Build verification — fix any build errors
### 3. Docker setup (Dockerfile, .dockerignore, docker-compose.yml) for Coolify
### 4. README.md — project overview, setup, structure, deployment
### 5. Package.json scripts verification
### 6. Deployment checklist document

Give me all files needed for production.
```

---

# TOTAL: 25 PROMPTS | 8 PHASES

# EXECUTION ORDER:
Phase 1: Prompts 1-3 → Foundation
Phase 2: Prompts 4-5 → Layout
Phase 3: Prompts 6-12 → Homepage (PREMIUM ANIMATED)
Phase 4: Prompts 13-15 → Product Pages
Phase 5: Prompts 16-18 → Supporting Pages
Phase 6: Prompt 19 → Blog
Phase 7: Prompts 20-24 → Polish
Phase 8: Prompt 25 → Deploy

# KEY ANIMATIONS ADDED IN THIS VERSION:

Homepage:
- Cinematic hero with gradient orbs, particle field, animated beams, grid overlay
- Network visualization with animated data-flow particles along SVG paths
- Spotlight/mouse-follow glow effect on ALL cards
- Scroll-driven animated timeline with gradient fill
- 3D perspective product carousel with center-focus scaling
- Stacked/deck testimonial cards with 3D rotation transitions
- Massive stat counters with glow pulse and ripple on finish
- Aurora/gradient mesh background on final CTA
- Infinite logo marquee with edge fade
- Animated gradient border badges
- Word-by-word text reveal animations
- Shimmer sweep on primary buttons
- Magnetic button effect on CTAs
- Cursor glow ambient lighting (Linear-style)
- Bento grid for industries section
- Glass-morphism on floating elements

# TIPS:
1. One prompt at a time
2. Test before moving on
3. New chat every 5-6 prompts
4. Replace placeholder content with real data
5. Test on mobile after every major section
6. If animations cause jank, reduce particle count or disable on mobile
