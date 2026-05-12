---
name: frontend-design
description: Use when designing or implementing frontend pages, components, apps, games, dashboards, visual tools, UI polish, responsive layout, or browser-verified quality.
user-invocable: true
---

# Frontend Design

## Overview

Build frontend with domain-specific taste. Codex reads the app, adapts to the audience, implements working UI, then checks desktop/mobile rendering.

## When to Use

Use for new or changed pages, components, apps, sites, games, dashboards, forms, visual tools, UI polish, layout repair, responsive behavior, motion, assets, accessibility, or broad prompts needing design choices. Skip backend-only work, docs-only edits, and mechanical design maintenance.

## Core Workflow

1. Inspect entry points, styles, components, assets, and tests. Reuse local stack, helpers, and icons.
2. Define audience, workflow, density, and tone. Tools need scannability; games, portfolios, products, and editorial pages can be expressive.
3. Choose one aesthetic direction. Derive palette, type, motion, and layout from the subject.
4. Implement the actual first screen, not a placeholder or feature description.
5. Run build/test/lint. Start a server if needed. Use Browser or Playwright desktop/mobile screenshots for rendering, assets, text fit, states, and overlap.

## Design Rules

| Area | Codex should do |
| --- | --- |
| Existing apps | Preserve conventions, spacing, states, routing, and data flow. |
| Assets | Show the subject with real, generated, searched, or code-native media. |
| Controls | Use icons, segmented controls, toggles, sliders/inputs, tabs, and menus appropriately. |
| Layout | Avoid nested cards. Use cards only for repeated items, modals, and framed tools. |
| Responsive | Stabilize fixed-format UI with aspect-ratio, min/max, grids, or container sizing. |
| Type | Use display scale only where earned. Avoid viewport-width font sizing. |
| Color | Avoid one-hue/default palettes. Use purposeful contrast and CSS variables. |
| Motion | Clarify state or create one memorable moment; respect reduced motion. |
| Access | Keep semantics, focus, contrast, keyboard reachability, labels, and tooltips. |

## Sites, Games, And 3D

- Branded, product, venue, portfolio, or object pages: show the subject first with image, media, or immersive scene; keep the next section peeking in.
- Avoid split heroes with the message trapped in a card. Use the H1 for the name, offer, or category.
- Use proven libraries for rules, physics, parsing, or AI. Use Three.js for 3D; keep scenes full-bleed or unframed; verify screenshots and canvas pixels.

## Verification Checklist

Before final response, confirm build/test/lint ran or limitation is explained; browser-rendered apps opened locally; desktop/mobile layouts were checked; images, icons, fonts, canvases, text, controls, and main workflow render correctly.

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Generic hero/cards | Start with the requested product, task, game, dashboard, or tool. |
| Marketing tone everywhere | Match domain density and audience. |
| Decorative blobs/cards/gradients | Use subject-specific assets, structure, type, and detail. |
| Ignoring the app | Read code first and extend patterns. |
| Code-only finish | Open the UI and verify visually. |
