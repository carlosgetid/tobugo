# TobuGo Payment Integration Design Guidelines

## Design Approach
**Reference-Based:** Drawing from Airbnb's clarity, Stripe's payment UX excellence, and Booking.com's conversion-focused patterns. Modern, trustworthy, and travel-optimized.

## Typography System
- **Primary Font:** Inter or DM Sans (clean, modern)
- **Display:** 32-48px bold for pricing, 24-32px for headlines
- **Body:** 16px regular, 14px for secondary info
- **Micro:** 12px for captions, metadata, disclaimers

## Layout System
**Spacing Units:** Tailwind 4, 6, 8, 12, 16 for consistent rhythm
- Cards: p-6 to p-8
- Sections: py-12 to py-16
- Max widths: max-w-6xl for content, max-w-md for payment forms

## Component Library

### Pricing Cards
- Clean cards with subtle elevation
- Large, bold pricing (48px)
- Feature lists with checkmark icons (Heroicons)
- Prominent CTA buttons at bottom
- "Most Popular" badge with subtle accent background
- 3-column grid (desktop), stack on mobile
- Include: Price, billing period, feature bullets, CTA, subtle comparison hints

### Checkout Flow Components
**Multi-step Progress Indicator:**
- Horizontal step tracker (1. Itinerary → 2. Payment → 3. Confirmation)
- Active step emphasized, completed steps with checkmarks

**Payment Form:**
- Single column, max-w-md centered
- Stripe Elements embedded seamlessly
- Order summary sticky sidebar (desktop) or collapsible section (mobile)
- Trust badges below payment button (SSL, secure checkout icons)
- Clear total breakdown with line items

**Order Summary Card:**
- Itinerary preview with thumbnail
- Destination, dates, travelers count
- Price breakdown (subtotal, taxes, total)
- Promo code field (collapsed by default)

### Payment Confirmation
- Large success icon (green checkmark circle, 64px)
- Clear confirmation message
- Receipt details card with download button
- Next steps (access itinerary, email sent confirmation)
- Secondary CTAs (View itinerary, Create another trip)

### Purchase History Dashboard
**Table Layout:**
- Date, Destination, Amount, Status, Actions columns
- Status badges (Completed, Processing, Refunded)
- Download/View buttons per row
- Filters: Date range, status
- Search by destination
- Empty state with illustration + CTA to plan new trip

### Monetization CTAs

**In-App Upgrade Prompts:**
- Non-intrusive banners after itinerary generation
- "Unlock full itinerary" modal with pricing preview
- Feature comparison (free vs premium) in 2-column layout

**Strategic Placement:**
- After AI generates preview (70% visible, blur rest)
- Download button triggers pricing modal for non-premium users
- Sidebar persistent upgrade card with benefits

**CTA Button Hierarchy:**
- Primary: "Download Itinerary - $X" (accent color, bold)
- Secondary: "View Pricing" (outline style)
- Tertiary: "Continue with Free Version" (text link)

## Images

**Hero Section (Pricing Page):**
- Wide landscape travel destination photo (mountains, beach, city skyline)
- Overlay gradient for text legibility
- Centered headline + pricing preview cards
- Buttons on image use backdrop-blur-sm with semi-transparent backgrounds

**Checkout Confirmation:**
- Destination thumbnail (small, 200x150px) in summary card
- Success illustration or travel icon

**Purchase History:**
- Small itinerary thumbnails (80x60px) per row
- Empty state illustration (luggage/map graphic)

## Accessibility & Trust
- WCAG AA contrast ratios
- Clear error states with inline validation
- Loading states for payment processing
- SSL badge, payment method logos prominently displayed
- Refund policy link visible in checkout
- Auto-save form progress

## Animation Budget
- Minimal: Success checkmark animation (scale + fade)
- Skeleton loaders during payment processing
- Smooth transitions between checkout steps (slide fade)
- No scroll animations, keep focus on conversion

## Critical Payment UX Patterns
- One-click purchase for returning users
- Guest checkout option
- Mobile-optimized Stripe elements
- Clear cancellation/refund policy visibility
- Email + PDF receipt generation
- Failed payment recovery flow with retry CTA