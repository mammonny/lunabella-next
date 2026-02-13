# Admin Branding LunaBella - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply LunaBella branding (colors, logo, typography) to the Payload CMS admin panel.

**Architecture:** Override Payload's CSS variables in `custom.scss` for colors/fonts, create two small React components for the logo graphics, upgrade the BeforeLogin component, and configure admin meta in `payload.config.ts`.

**Tech Stack:** Payload CMS 3.31, Next.js 15, SCSS, React

---

### Task 1: CSS Theme Overrides

**Files:**
- Modify: `src/app/(payload)/custom.scss` (currently empty)

**Step 1: Write the SCSS overrides**

The file currently only has `@import '~@payloadcms/ui/scss';` (or is empty). Replace its content with LunaBella theme overrides:

```scss
// LunaBella Admin Theme
// Overrides Payload CMS default variables

:root {
  // Typography
  --font-body: 'DM Sans', system-ui, -apple-system, sans-serif;

  // Light mode - LunaBella palette
  --theme-elevation-0: #faf8f5;    // warm white background
  --theme-elevation-50: #f5f2ed;   // slightly darker
  --theme-elevation-100: #ece8e1;  // crema LunaBella
  --theme-elevation-150: #ddd7cc;  // borders
  --theme-elevation-200: #d1c9bc;
  --theme-elevation-250: #c5bcad;
  --theme-elevation-300: #b9ae9e;
  --theme-elevation-350: #ada18f;
  --theme-elevation-400: #a19480;
  --theme-elevation-450: #958771;
  --theme-elevation-500: #897a62;
  --theme-elevation-550: #7d6d53;
  --theme-elevation-600: #716044;
  --theme-elevation-650: #5a4d36;
  --theme-elevation-700: #433a29;
  --theme-elevation-750: #2c261b;
  --theme-elevation-800: #1a1a1a;  // charcoal text
  --theme-elevation-850: #111111;
  --theme-elevation-900: #0a0a0a;
  --theme-elevation-950: #050505;
  --theme-elevation-1000: #000000;

  // Success colors -> Gold LunaBella (replaces Payload blue)
  --theme-success-50: #fdf9ef;
  --theme-success-100: #faf0d5;
  --theme-success-150: #f5e4b5;
  --theme-success-200: #f0d895;
  --theme-success-250: #e5c76e;
  --theme-success-300: #dbb74d;
  --theme-success-350: #d1a73d;
  --theme-success-400: #c9a93d;
  --theme-success-450: #b7952e;
  --theme-success-500: #a58a1b;
  --theme-success-550: #967d19;
  --theme-success-600: #8a7316;
  --theme-success-650: #7a6513;
  --theme-success-700: #6a5810;
  --theme-success-750: #5a4a0d;
  --theme-success-800: #4a3d0b;
  --theme-success-850: #3a3008;
  --theme-success-900: #2a2306;
  --theme-success-950: #1a1604;

  // Input background
  --theme-input-bg: #faf8f5;
}

html[data-theme='dark'] {
  // Dark mode: keep dark backgrounds, apply gold accents
  --theme-success-50: #1a1604;
  --theme-success-100: #2a2306;
  --theme-success-150: #3a3008;
  --theme-success-200: #4a3d0b;
  --theme-success-250: #5a4a0d;
  --theme-success-300: #6a5810;
  --theme-success-350: #7a6513;
  --theme-success-400: #8a7316;
  --theme-success-450: #967d19;
  --theme-success-500: #a58a1b;
  --theme-success-550: #b7952e;
  --theme-success-600: #c9a93d;
  --theme-success-650: #d1a73d;
  --theme-success-700: #dbb74d;
  --theme-success-750: #e5c76e;
  --theme-success-800: #f0d895;
  --theme-success-850: #f5e4b5;
  --theme-success-900: #faf0d5;
  --theme-success-950: #fdf9ef;
}

// Nav sidebar branding
.nav {
  .nav__brand {
    img {
      max-height: 40px;
      width: auto;
    }
  }
}

// Login page enhancements
.login {
  background-color: #ece8e1;

  .login__brand {
    img {
      max-height: 80px;
      width: auto;
    }
  }
}
```

**Step 2: Verify in browser**

Run: `pnpm dev`
Navigate to: `http://localhost:3000/admin`
Expected: Admin panel shows warm crema tones instead of white, gold accents instead of blue.

**Step 3: Commit**

```bash
git add src/app/(payload)/custom.scss
git commit -m "feat(admin): apply LunaBella color theme to admin panel"
```

---

### Task 2: Logo Components

**Files:**
- Create: `src/components/AdminLogo/index.tsx`
- Create: `src/components/AdminIcon/index.tsx`

**Step 1: Create AdminLogo component**

```tsx
import React from 'react'

const AdminLogo: React.FC = () => {
  return (
    <img
      src="/logo-lunabella-golden.png"
      alt="LunaBella"
      style={{ maxHeight: '40px', width: 'auto' }}
    />
  )
}

export default AdminLogo
```

**Step 2: Create AdminIcon component**

```tsx
import React from 'react'

const AdminIcon: React.FC = () => {
  return (
    <img
      src="/logo-lunabella-s.png"
      alt="LunaBella"
      style={{ maxHeight: '24px', width: 'auto' }}
    />
  )
}

export default AdminIcon
```

**Step 3: Commit**

```bash
git add src/components/AdminLogo/index.tsx src/components/AdminIcon/index.tsx
git commit -m "feat(admin): add LunaBella logo components for admin nav"
```

---

### Task 3: Upgrade BeforeLogin Component

**Files:**
- Modify: `src/components/BeforeLogin/index.tsx`

**Step 1: Rewrite BeforeLogin with branding**

```tsx
import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: '#6b6560', fontSize: '14px', margin: 0 }}>
        Panel de administracion
      </p>
    </div>
  )
}

export default BeforeLogin
```

**Step 2: Commit**

```bash
git add src/components/BeforeLogin/index.tsx
git commit -m "feat(admin): brand login page with LunaBella identity"
```

---

### Task 4: Register Components and Meta in Payload Config

**Files:**
- Modify: `src/payload.config.ts`

**Step 1: Add meta and graphics to admin config**

In the `admin` section of `buildConfig`, add:

```typescript
admin: {
  meta: {
    titleSuffix: ' - LunaBella',
    icons: [{ url: '/logo-lunabella-s.png' }],
  },
  components: {
    beforeLogin: ['@/components/BeforeLogin'],
    beforeDashboard: ['@/components/BeforeDashboard'],
    graphics: {
      Logo: '@/components/AdminLogo',
      Icon: '@/components/AdminIcon',
    },
  },
  // ... rest of admin config (importMap, user, livePreview)
}
```

**Step 2: Regenerate import map**

Run: `pnpm payload generate:importmap`

**Step 3: Verify everything works**

Run: `pnpm dev`
Navigate to: `http://localhost:3000/admin`
Expected:
- LunaBella logo in sidebar
- Small icon when nav collapsed
- Branded login page with logo
- Browser tab shows "Dashboard - LunaBella"
- Favicon is LunaBella logo

**Step 4: Commit**

```bash
git add src/payload.config.ts
git commit -m "feat(admin): register logo components and meta in Payload config"
```

---

### Task 5: Clean Up BeforeDashboard

**Files:**
- Modify: `src/components/BeforeDashboard/index.tsx`

**Step 1: Replace template content with LunaBella welcome**

The current BeforeDashboard has Payload template instructions (clone repo, modify collections, etc.) that are no longer relevant. Replace with a clean welcome:

```tsx
import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const BeforeDashboard: React.FC = () => {
  return (
    <div className="before-dashboard">
      <Banner className="before-dashboard__banner" type="success">
        <h4>Bienvenido a LunaBella</h4>
      </Banner>
      <p>Gestiona tus perros, camadas, cachorros y contenido del sitio web desde aqui.</p>
    </div>
  )
}

export default BeforeDashboard
```

**Step 2: Commit**

```bash
git add src/components/BeforeDashboard/index.tsx
git commit -m "feat(admin): replace template dashboard with LunaBella welcome"
```

---

### Task 6: Visual Verification

**Step 1: Full check**

Run: `pnpm dev`
Verify at `http://localhost:3000/admin`:
- [ ] Login page: crema background, LunaBella logo, gold accents
- [ ] Dashboard: warm crema tones, gold success banner, LunaBella welcome
- [ ] Sidebar: LunaBella logo replaces Payload logo
- [ ] Browser tab: favicon and title suffix work
- [ ] Dark mode toggle: gold accents maintained, dark backgrounds intact
- [ ] Forms/inputs: warm white backgrounds, gold focus states
- [ ] No visual regressions in collection views

**Step 2: Build check**

Run: `pnpm build`
Expected: Build succeeds with no errors.

**Step 3: Final commit if any tweaks needed**
