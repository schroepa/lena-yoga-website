# Farb-Tokens

Basisfarbe **#79A18F** (Salbei). Skalen erzeugt mit [Tintfield](https://tintfield.ptrckschrdtr.de/), Schema **Fein (50er)**: 19 Stufen von 50 bis 950.

## Basisfarben

| Skala | Basis | Hex | Rolle |
|---|---|---|---|
| sage | sage.450 | `#79A18F` | Primär, Hauptfarbe |
| watermelon | watermelon.450 | `#FF6F83` | Frech, Akzent für CTAs |
| lilac | lilac.350 | `#C9BBF2` | Extra, dritter Akzent |
| cream | cream.100 | `#F6F3EA` | Flächen, Hintergrund |
| butter | butter.250 | `#F7D974` | Lieb, Badges und Marker |
| ink | ink.900 | `#162E27` | Text und dunkle Bereiche |

## Semantische Tokens

| Token | Verweist auf | Hex |
|---|---|---|
| `surface.page` | cream.100 | `#F6F3EA` |
| `surface.raised` | cream.50 | `#F8F6EE` |
| `surface.brand` | sage.450 | `#79A18F` |
| `surface.inverse` | ink.900 | `#162E27` |
| `text.primary` | ink.900 | `#162E27` |
| `text.on-brand` | ink.900 | `#162E27` |
| `text.on-accent` | ink.900 | `#162E27` |
| `text.on-inverse` | cream.100 | `#F6F3EA` |
| `text.muted` | sage.700 | `#3D5F50` |
| `brand.default` | sage.450 | `#79A18F` |
| `brand.hover` | sage.500 | `#699481` |
| `brand.pressed` | sage.550 | `#598673` |
| `brand.subtle` | sage.150 | `#E6EDEA` |
| `accent.default` | watermelon.450 | `#FF6F83` |
| `accent.hover` | watermelon.500 | `#FD5070` |
| `accent.pressed` | watermelon.550 | `#F42F5F` |
| `accent.subtle` | watermelon.150 | `#FFE8EA` |
| `highlight.default` | butter.250 | `#F7D974` |
| `highlight.subtle` | butter.100 | `#FFF3C9` |
| `extra.default` | lilac.350 | `#C9BBF2` |
| `extra.subtle` | lilac.100 | `#F5F2FF` |
| `border.default` | cream.250 | `#DFD9C5` |
| `border.strong` | sage.350 | `#A5BEB3` |
| `focus.ring` | watermelon.450 | `#FF6F83` |

## Regeln

- Verteilung: ca. 60 % Cream, 25 % Sage und Ink, 15 % Watermelon, Butter und Lilac.
- Text auf Sage 450 und Watermelon 450 immer in Ink 900. Weiß erreicht auf Sage nur ca. 2,9:1.
- Watermelon sparsam einsetzen (CTAs, Hover, Highlights).
- Schritte von 50 zu 50 für Hover, Pressed und Hintergründe nutzen, nie eigene Hex-Werte erfinden.

## Dateien

- `colors.tokens.json`: Design Tokens (W3C-Format) inkl. semantischer Aliase
- `colors.css`: CSS-Variablen für direkte Nutzung

## Figma-Import

`colors.figma.tokens.json` ist für das Plugin **Tokens Studio for Figma** gedacht (Settings, Load from file/folder, dann Export to Figma, Variables). Es enthält zwei Sets: `primitives` (6 Skalen mit je 19 Stufen) und `semantic` (Aliase auf die Primitives) sowie ein Theme „Light".

## Sizing und Spacing

**Sizing** (`--sizing-*`): 0, 1, 2 und danach 4px-Schritte bis 128 (35 Werte). In Figma als Collection „Sizing", Scope Breite/Höhe.

**Spacing** (`--spacing-*`): 13 Stufen, die auf Sizing verweisen. In Figma als Collection „Spacing", Scope Gap/Padding.

| Token | Sizing | Wert |
|---|---|---|
| spacing-none | sizing-0 | 0px |
| spacing-hairline | sizing-1 | 1px |
| spacing-3xs | sizing-2 | 2px |
| spacing-2xs | sizing-4 | 4px |
| spacing-xs | sizing-8 | 8px |
| spacing-sm | sizing-12 | 12px |
| spacing-md | sizing-16 | 16px |
| spacing-lg | sizing-24 | 24px |
| spacing-xl | sizing-32 | 32px |
| spacing-2xl | sizing-48 | 48px |
| spacing-3xl | sizing-64 | 64px |
| spacing-4xl | sizing-96 | 96px |
| spacing-5xl | sizing-128 | 128px |

Dateien: `sizing-spacing.tokens.json`, `sizing-spacing.css`.

### Spacing-Gruppen

- **Skala** (`spacing/xs` …): allgemeine Stufen.
- **Layout** (`spacing/layout/*`): Seitenränder, Gutter, Stack-Abstände, Sektionsabstände der Applikation.
- **Component** (`spacing/component/*`): `inset-*` (Innenabstand) und `gap-*` (Abstand zwischen Elementen) für Komponenten.

Alle verweisen direkt auf Sizing.

| layout | Sizing | Wert |
|---|---|---|
| spacing-layout-page-margin-sm | sizing-16 | 16px |
| spacing-layout-page-margin-md | sizing-32 | 32px |
| spacing-layout-page-margin-lg | sizing-64 | 64px |
| spacing-layout-gutter-sm | sizing-16 | 16px |
| spacing-layout-gutter-md | sizing-24 | 24px |
| spacing-layout-gutter-lg | sizing-32 | 32px |
| spacing-layout-stack-xs | sizing-8 | 8px |
| spacing-layout-stack-sm | sizing-16 | 16px |
| spacing-layout-stack-md | sizing-24 | 24px |
| spacing-layout-stack-lg | sizing-32 | 32px |
| spacing-layout-stack-xl | sizing-48 | 48px |
| spacing-layout-section-sm | sizing-48 | 48px |
| spacing-layout-section-md | sizing-64 | 64px |
| spacing-layout-section-lg | sizing-96 | 96px |
| spacing-layout-section-xl | sizing-128 | 128px |

| component | Sizing | Wert |
|---|---|---|
| spacing-component-inset-xs | sizing-4 | 4px |
| spacing-component-inset-sm | sizing-8 | 8px |
| spacing-component-inset-md | sizing-12 | 12px |
| spacing-component-inset-lg | sizing-16 | 16px |
| spacing-component-inset-xl | sizing-24 | 24px |
| spacing-component-gap-xs | sizing-4 | 4px |
| spacing-component-gap-sm | sizing-8 | 8px |
| spacing-component-gap-md | sizing-12 | 12px |
| spacing-component-gap-lg | sizing-16 | 16px |


Ausführliche Spacing-Dokumentation mit Verwendungszweck pro Token: [SPACING.md](SPACING.md).
