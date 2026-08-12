---
kind: frontend_style
name: Tailwind-First Styling with Shared Design Tokens Across Mobile and Web
category: frontend_style
scope:
    - '**'
source_files:
    - mobile-app/src/constants/colors.ts
    - mobile-app/src/constants/theme.ts
    - mobile-app/tailwind.config.js
    - web-dashboard/tailwind.config.ts
    - web-dashboard/src/app/globals.css
    - web-dashboard/src/components/ui/button.tsx
    - mobile-app/src/components/shared/Header.tsx
    - mobile-app/src/components/shared/SOSButton.tsx
---

## What system/approach is used

The SafeProtect platform uses **Tailwind CSS** as the primary styling approach across both frontend applications, with a shared design-token strategy to keep the mobile app (Expo/React Native) and web dashboard (Next.js) visually consistent. The mobile app combines Tailwind for layout utilities with React Native `StyleSheet` for native-specific properties, while the web dashboard follows a shadcn/ui-style pattern built on Tailwind, Radix UI primitives, and `class-variance-authority` (CVA) for component variants.

## Key files and packages

- **Mobile app tokens**: `mobile-app/src/constants/colors.ts`, `mobile-app/src/constants/theme.ts`
- **Mobile Tailwind config**: `mobile-app/tailwind.config.js`
- **Web dashboard Tailwind config**: `web-dashboard/tailwind.config.ts`
- **Web global CSS variables**: `web-dashboard/src/app/globals.css`
- **Web UI primitives** (shadcn-style): `web-dashboard/src/components/ui/{button,badge,card,input,table,avatar}.tsx`
- **Shared mobile components using tokens**: `mobile-app/src/components/shared/Header.tsx`, `SOSButton.tsx`, `StatusBadge.tsx`, etc.

## Architecture and conventions

### Design tokens are centralized per platform

- **Mobile**: Colors (`COLORS`) and spacing/border-radius (`THEME`) are exported from dedicated constants under `src/constants/`. Components import these directly (e.g., `Header` uses `COLORS.textPrimary`).
- **Web**: Semantic CSS custom properties (`--primary`, `--background`, `--destructive`, etc.) are defined in `globals.css` under `:root`, then referenced via Tailwind's `hsl(var(...))` syntax in `tailwind.config.ts`. This enables theming through CSS variables rather than hard-coded hex values in components.

### Shared color palette across platforms

Both apps converge on the same brand colors:
- Primary: `#5B3FD3` (purple)
- Primary light: `#8B6FF7`
- Emergency/destructive: `#FF2E55`
- Success: `#2E7D32`
- Warning: `#E65100`
- Background: `#F8F9FE`
- Text primary: `#1E1E2D`
- Text secondary: `#75759E`

This ensures visual consistency between the victim/social worker mobile experience and the admin dashboard.

### Component styling patterns

- **Mobile**: Uses a hybrid approach — Tailwind utility classes for layout/spacing (e.g., `className="w-48 h-48 rounded-full bg-emergency"` in `SOSButton`) combined with `StyleSheet.create` blocks for native-only properties like `flexDirection`, `paddingHorizontal`, `borderBottomWidth`. Components live under `src/components/shared/` and are reused across screens.
- **Web**: Follows a shadcn/ui-inspired convention where each UI primitive lives in `src/components/ui/` and is composed with CVA variant maps (`buttonVariants`, etc.). Variants cover `variant` (default, destructive, outline, secondary, ghost, link) and `size` (default, sm, lg, icon). Components use a `cn()` utility (from `@/lib/utils`) to merge class names.

### Responsive strategy

- **Mobile**: Relies on React Native's responsive model plus Tailwind's responsive prefixes; safe area insets are handled via `react-native-safe-area-context` (see `Header` padding logic).
- **Web**: Tailwind container with `center: true`, `padding: "2rem"`, and a `2xl` breakpoint at `1400px`; dark mode is enabled via `darkMode: ["class"]` in `tailwind.config.ts`, allowing runtime theme toggling through CSS classes.

### Typography and spacing

- Mobile defines a tokenized spacing scale (`xs: 4, sm: 8, md: 16, lg: 24, xl: 32`) and border-radius tokens (`sm: 8, md: 12, lg: 16, xl: 24, full: 9999`).
- Web extends Tailwind's default radius with `lg: 12px`, `md: 8px`, `sm: 4px` and sets `fontFamily.sans` to `var(--font-inter)`.

## Conventions and constraints

- **Colors must come from tokens**: Mobile components import `COLORS` rather than hard-coding hex values; web components reference semantic Tailwind color classes derived from CSS variables, not raw hex strings.
- **UI primitives are single-source-of-truth**: All buttons go through the `Button` component in `web-dashboard/src/components/ui/button.tsx` (or equivalent), which centralizes variant and size definitions via CVA. Ad-hoc inline styles for common interactive elements are discouraged.
- **Tailwind content paths are scoped**: Both `tailwind.config.js` and `tailwind.config.ts` explicitly declare `content` globs so unused styles are purged in production builds.
- **Dark mode is class-based on the web**: Enabled via `darkMode: ["class"]`, meaning theme switching is opt-in per page/component rather than automatic.
- **Consistent semantic naming**: Both platforms use the same semantic color names (`primary`, `emergency`, `success`, `warning`, `background`, `textPrimary`, `textSecondary`), making cross-platform visual parity straightforward.