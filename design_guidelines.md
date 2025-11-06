# TobuGo Design System

## Design Philosophy
**Professional Travel Platform**: Drawing inspiration from Airbnb's clarity, Booking.com's intuitive navigation, and modern SaaS design patterns. The design emphasizes trust, exploration, and seamless user experience for travelers in Uruguay and Latin America.

## Color System

### Primary Palette
```css
/* Light Mode */
--ocean-deep: 220 40% 20%      /* Deep navy - primary brand color */
--ocean-primary: 195 85% 45%   /* Aqua blue - interactive elements */
--coral-accent: 15 90% 60%     /* Coral - CTAs and highlights */
--sand-50: 40 40% 97%          /* Lightest neutral */
--sand-100: 40 25% 92%         /* Light background */
--sand-200: 40 15% 85%         /* Borders */
--sand-300: 40 10% 70%         /* Disabled states */
--sand-500: 40 8% 50%          /* Secondary text */
--sand-700: 40 10% 30%         /* Primary text */
--sand-900: 40 15% 15%         /* Headings */

/* Dark Mode */
--ocean-deep-dark: 220 35% 12%      /* Dark background base */
--ocean-primary-dark: 195 80% 50%   /* Brighter aqua for dark */
--coral-accent-dark: 15 85% 65%     /* Brighter coral for dark */
--slate-900: 220 20% 10%            /* Darkest background */
--slate-800: 220 18% 15%            /* Card/surface background */
--slate-700: 220 15% 25%            /* Elevated surfaces */
--slate-600: 220 12% 35%            /* Borders */
--slate-500: 220 10% 50%            /* Disabled/muted */
--slate-400: 220 8% 65%             /* Secondary text */
--slate-300: 220 10% 75%            /* Primary text */
--slate-100: 220 15% 90%            /* Headings */
```

### Semantic Colors
```css
/* Light Mode */
--success: 142 76% 36%         /* Green for confirmations */
--warning: 38 92% 50%          /* Amber for warnings */
--error: 0 84% 60%            /* Red for errors */
--info: 217 91% 60%           /* Blue for info */

/* Dark Mode (adjusted for better contrast) */
--success-dark: 142 71% 45%
--warning-dark: 38 90% 60%
--error-dark: 0 84% 65%
--info-dark: 217 91% 65%
```

### Color Application Guidelines

**Light Mode:**
- Page background: `bg-sand-50`
- Card backgrounds: `bg-white`
- Card borders: `border-sand-200`
- Headings: `text-sand-900`
- Body text: `text-sand-700`
- Secondary text: `text-sand-500`
- Muted text: `text-sand-400`
- Disabled: `text-sand-300 bg-sand-100`
- Primary buttons: `bg-ocean-primary text-white`
- Accent buttons: `bg-coral-accent text-white`

**Dark Mode:**
- Page background: `dark:bg-slate-900`
- Card backgrounds: `dark:bg-slate-800`
- Elevated cards: `dark:bg-slate-700`
- Card borders: `dark:border-slate-600`
- Headings: `dark:text-slate-100`
- Body text: `dark:text-slate-300`
- Secondary text: `dark:text-slate-400`
- Muted text: `dark:text-slate-500`
- Disabled: `dark:text-slate-500 dark:bg-slate-700`
- Primary buttons: `dark:bg-ocean-primary-dark dark:text-white`
- Accent buttons: `dark:bg-coral-accent-dark dark:text-white`

**Usage Example:**
```jsx
<div className="bg-white dark:bg-slate-800 border border-sand-200 dark:border-slate-600">
  <h2 className="text-sand-900 dark:text-slate-100">Heading</h2>
  <p className="text-sand-700 dark:text-slate-300">Body text</p>
  <p className="text-sand-500 dark:text-slate-400">Secondary text</p>
</div>
```

## Typography System

### Font Families
```css
--font-sans: 'DM Sans', system-ui, -apple-system, sans-serif
--font-display: 'Playfair Display', Georgia, serif
--font-mono: 'JetBrains Mono', monospace
```

### Type Scale
```css
--text-xs: 12px / 1.4      /* Captions, metadata */
--text-sm: 14px / 1.5      /* Secondary info, labels */
--text-base: 16px / 1.6    /* Body text */
--text-lg: 18px / 1.6      /* Large body, callouts */
--text-xl: 24px / 1.4      /* Section headings */
--text-2xl: 32px / 1.3     /* Page headings */
--text-3xl: 40px / 1.2     /* Hero headings */
--text-4xl: 48px / 1.1     /* Display text */
--text-5xl: 64px / 1       /* Hero display */
```

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (labels, emphasis)
- **Semibold**: 600 (subheadings, buttons)
- **Bold**: 700 (headings, pricing)

### Usage Guidelines
- Hero sections: font-display, text-4xl or text-5xl, bold
- Page titles: font-sans, text-2xl or text-3xl, bold
- Section headings: font-sans, text-xl, semibold
- Body text: font-sans, text-base, regular
- Buttons: font-sans, text-sm or text-base, semibold
- Captions: font-sans, text-xs or text-sm, regular

## Spacing System

### Base Units
```css
--space-1: 4px     /* Micro spacing */
--space-2: 8px     /* Small gaps */
--space-3: 12px    /* Standard gaps */
--space-4: 16px    /* Default spacing */
--space-5: 20px    /* Medium spacing */
--space-6: 24px    /* Large spacing */
--space-8: 32px    /* Section spacing */
--space-10: 40px   /* Large sections */
--space-12: 48px   /* Hero sections */
--space-16: 64px   /* Major sections */
--space-20: 80px   /* Page sections */
```

### Layout Spacing
- **Component padding**: p-6 (cards), p-4 (compact cards)
- **Section padding**: py-20 (desktop), py-12 (mobile)
- **Container max-width**: max-w-7xl (main content)
- **Form max-width**: max-w-md (single column forms)
- **Content max-width**: max-w-4xl (article content)
- **Grid gaps**: gap-6 (default), gap-4 (compact)

## Elevation System

### Shadows
```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05)
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
--shadow-base: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
```

### Application
- Cards at rest: shadow-sm
- Cards hover: shadow-base
- Modals/Drawers: shadow-xl
- Dropdown menus: shadow-lg
- Buttons: no shadow (use solid colors)

## Component Patterns

### Navigation
**Desktop Header**
- Sticky top navigation, bg-white/ocean-deep-dark
- Logo left, nav links center, CTA right
- Height: h-16
- Padding: px-6
- Border bottom: border-b border-sand-200

**Mobile Navigation**
- Sheet/drawer menu from right
- Full-height overlay
- Large touch targets (min 44px)
- Clear close button

### Hero Sections
**Landing Hero**
- Full viewport height option or min-h-[600px]
- Background: gradient overlay on video/image
- Content centered with max-w-4xl
- Large headline (text-4xl to text-5xl)
- Subtitle (text-lg, sand-400)
- CTA buttons with gap-4
- Trust badges/social proof below

### Cards
**Trip Cards**
- Image aspect ratio: 16:9 or 4:3
- Padding: p-6
- Border radius: rounded-xl
- Hover: scale-[1.02], shadow-lg transition
- Badge positioning: absolute top-4 right-4
- Cost summary: mt-4, flex justify-between
- CTA at bottom: full-width or flex justify-end

**Community Cards**
- Compact design with thumbnail
- Quick preview on hover
- Star rating visible
- Save/bookmark icon

### Forms & Inputs
**Input Fields**
- Height: h-11 (44px minimum for accessibility)
- Border: border-sand-200, focus:border-ocean-primary
- Ring on focus: ring-2 ring-ocean-primary/20
- Padding: px-4
- Font size: text-base
- Placeholder: text-sand-400

**Buttons**
- Primary: bg-ocean-primary text-white
- Secondary: bg-coral-accent text-white
- Outline: border-ocean-primary text-ocean-primary
- Ghost: text-ocean-primary hover:bg-ocean-primary/10
- Height: h-10 (default), h-11 (large), h-9 (small)
- Padding: px-6 (default), px-8 (large)
- Border radius: rounded-lg
- Font weight: semibold

### Chat Interface
**Layout**
- Split layout on desktop (chat left, context right)
- Full width on mobile
- Max content width: max-w-4xl

**Messages**
- User messages: bg-ocean-primary text-white, rounded-2xl
- AI messages: bg-sand-100 text-sand-900, rounded-2xl
- Padding: px-4 py-3
- Max width: 80%
- Gap between messages: space-3

**Quick Response Chips**
- Segmented control style or pill buttons
- Border: border-ocean-primary
- Hover: bg-ocean-primary/10
- Active: bg-ocean-primary text-white
- Padding: px-4 py-2
- Font size: text-sm

### Checkout/Payment
**Modal/Drawer**
- Full-height drawer on mobile
- Centered modal on desktop (max-w-lg)
- Three-step progress indicator at top
- Trust signals: SSL badge, payment logos
- Order summary card with border
- Price display: text-4xl bold
- CTA button: full-width, h-12, coral-accent

### Empty States
- Centered content with max-w-md
- Icon or illustration (size 64-80px)
- Heading (text-xl, semibold)
- Description (text-base, sand-600)
- CTA button below

## Accessibility

### Contrast Requirements
- Text: minimum 4.5:1 (WCAG AA)
- Large text (18px+): minimum 3:1
- Interactive elements: minimum 3:1
- Focus indicators: 3px solid ring with 2px offset

### Interactive Elements
- Minimum touch target: 44x44px
- Keyboard navigation: clear focus states
- Screen reader: proper ARIA labels
- Skip to content link for keyboard users

### Motion & Animation
- Respect prefers-reduced-motion
- Transitions: 150-300ms ease-in-out
- Avoid auto-play videos (or provide controls)
- Loading states: skeleton or spinner

## Responsive Breakpoints
```css
sm: 640px    /* Tablet portrait */
md: 768px    /* Tablet landscape */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile-First Approach
- Design for mobile, enhance for desktop
- Stack cards on mobile, grid on desktop
- Hide secondary navigation on mobile (hamburger)
- Simplify complex tables on mobile (cards)

## Iconography
- Library: Lucide React
- Size: 16px (small), 20px (default), 24px (large), 32px (XL)
- Stroke width: 2 (default), 1.5 (subtle)
- Color: inherit or explicit (text-ocean-primary)

## Micro-Interactions
**Hover States**
- Buttons: brightness increase or background opacity change
- Cards: subtle scale (1.02) + shadow increase
- Links: underline or color change

**Loading States**
- Skeleton screens for content
- Spinner for actions (button loading)
- Progress bars for multi-step processes

**Success/Error States**
- Success: checkmark icon + green color
- Error: X icon + red color + helper text
- Animated appearance (fade + scale)

## Brand Voice in UI
- Friendly but professional
- Use "Tu" (informal) for conversational tone
- Clear, concise copy
- Action-oriented button labels ("Crear itinerario", "Descargar PDF")
- Avoid jargon, use plain Spanish

## Content Guidelines
- Headlines: benefit-driven, clear value proposition
- Buttons: verb-first ("Crear", "Descargar", "Explorar")
- Errors: explain what happened + how to fix
- Empty states: encourage action with positive message
- Loading: set expectations ("Generando tu itinerario...")
