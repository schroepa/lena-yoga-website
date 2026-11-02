# Spacing-Tokens

Alle Spacing-Tokens verweisen auf Sizing (`sizing/<px>`). Ändert sich ein Sizing-Wert, folgt Spacing automatisch.

## Welchen Token nehme ich?

1. **Abstand zwischen Seitenrand, Spalten, Blöcken oder Sektionen?** Nimm `spacing/layout/*`.
2. **Abstand innerhalb einer Komponente (Padding oder Gap)?** Nimm `spacing/component/*`.
3. **Weder noch (einmalige Feinheit, Prototyp)?** Nimm die Basisskala `spacing/xs` bis `spacing/5xl`.

Namensregel: `-xs` bis `-xl` wachsen mit dem Abstand. Bei `page-margin`, `gutter` und `section` stehen `-sm`, `-md`, `-lg` für Mobile, Tablet und Desktop (bei `section` für klein bis groß).

## Layout (`spacing/layout/*`)

Für die Struktur der Seite: Ränder, Spalten, Blöcke, Sektionen.

| CSS-Variable | Figma-Variable | Wert | Zweck |
|---|---|---|---|
| `--spacing-layout-page-margin-sm` | `spacing/layout/page-margin-sm` | 16px | Seitenrand auf kleinen Screens (Mobile). Abstand zwischen Bildschirmrand und Inhalt. |
| `--spacing-layout-page-margin-md` | `spacing/layout/page-margin-md` | 32px | Seitenrand auf mittleren Screens (Tablet). Abstand zwischen Bildschirmrand und Inhalt. |
| `--spacing-layout-page-margin-lg` | `spacing/layout/page-margin-lg` | 64px | Seitenrand auf großen Screens (Desktop). Abstand zwischen Bildschirmrand und Inhalt. |
| `--spacing-layout-gutter-sm` | `spacing/layout/gutter-sm` | 16px | Spaltenabstand im Grid auf Mobile. Abstand zwischen zwei Spalten. |
| `--spacing-layout-gutter-md` | `spacing/layout/gutter-md` | 24px | Spaltenabstand im Grid auf Tablet. Abstand zwischen zwei Spalten. |
| `--spacing-layout-gutter-lg` | `spacing/layout/gutter-lg` | 32px | Spaltenabstand im Grid auf Desktop. Abstand zwischen zwei Spalten. |
| `--spacing-layout-stack-xs` | `spacing/layout/stack-xs` | 8px | Vertikaler Abstand zwischen eng zusammengehörigen Blöcken, z. B. Überschrift und Unterzeile. |
| `--spacing-layout-stack-sm` | `spacing/layout/stack-sm` | 16px | Vertikaler Abstand zwischen Blöcken, z. B. Absatz und Absatz. |
| `--spacing-layout-stack-md` | `spacing/layout/stack-md` | 24px | Standard-Abstand zwischen Blöcken innerhalb einer Sektion, z. B. Text und Bild. |
| `--spacing-layout-stack-lg` | `spacing/layout/stack-lg` | 32px | Größerer Abstand zwischen Blöcken innerhalb einer Sektion, z. B. Intro und Kartenreihe. |
| `--spacing-layout-stack-xl` | `spacing/layout/stack-xl` | 48px | Abstand zwischen klar getrennten Blockgruppen innerhalb einer Sektion. |
| `--spacing-layout-section-sm` | `spacing/layout/section-sm` | 48px | Abstand zwischen zwei Sektionen auf Mobile. Oben und unten einer Sektion. |
| `--spacing-layout-section-md` | `spacing/layout/section-md` | 64px | Abstand zwischen zwei Sektionen (Standard). Oben und unten einer Sektion. |
| `--spacing-layout-section-lg` | `spacing/layout/section-lg` | 96px | Abstand zwischen Sektionen auf Desktop. Oben und unten einer Sektion. |
| `--spacing-layout-section-xl` | `spacing/layout/section-xl` | 128px | Maximaler Sektionsabstand, z. B. um Hero oder Abschlussbereich. |

## Component (`spacing/component/*`)

Für das Innere von Komponenten. `inset` ist Innenabstand (Padding), `gap` ist der Abstand zwischen Elementen.

| CSS-Variable | Figma-Variable | Wert | Zweck |
|---|---|---|---|
| `--spacing-component-inset-xs` | `spacing/component/inset-xs` | 4px | Innenabstand (Padding) in sehr kleinen Komponenten, z. B. Badge, Chip. |
| `--spacing-component-inset-sm` | `spacing/component/inset-sm` | 8px | Innenabstand in kleinen Komponenten, z. B. kleiner Button, Tag. |
| `--spacing-component-inset-md` | `spacing/component/inset-md` | 12px | Innenabstand in Standard-Komponenten, z. B. Button, Eingabefeld. |
| `--spacing-component-inset-lg` | `spacing/component/inset-lg` | 16px | Innenabstand in Containern, z. B. Karte, Menü. |
| `--spacing-component-inset-xl` | `spacing/component/inset-xl` | 24px | Innenabstand in großen Containern, z. B. Dialog, große Karte. |
| `--spacing-component-gap-xs` | `spacing/component/gap-xs` | 4px | Abstand zwischen Elementen in einer Komponente: Icon und Zahl, Punkt und Text. |
| `--spacing-component-gap-sm` | `spacing/component/gap-sm` | 8px | Abstand zwischen Elementen in einer Komponente: Icon und Label im Button, Label und Feld. |
| `--spacing-component-gap-md` | `spacing/component/gap-md` | 12px | Abstand zwischen Elementen in einer Komponente: Zeilen in Listen, Felder in einem Formular. |
| `--spacing-component-gap-lg` | `spacing/component/gap-lg` | 16px | Abstand zwischen Gruppen in einer Komponente: Titel, Inhalt und Aktionen einer Karte. |

## Basisskala (`spacing/*`)

Allgemeine Stufen, wenn keine der beiden Gruppen passt.

| CSS-Variable | Figma-Variable | Wert | Zweck |
|---|---|---|---|
| `--spacing-none` | `spacing/none` | 0px | Kein Abstand. Zum bewussten Zurücksetzen eines Abstands. |
| `--spacing-hairline` | `spacing/hairline` | 1px | Haarlinie. Nur für 1px-Feinheiten, z. B. Versatz neben einem Rahmen. Nicht für normales Spacing. |
| `--spacing-3xs` | `spacing/3xs` | 2px | Minimaler optischer Ausgleich, z. B. Icon und Textlinie feinjustieren. |
| `--spacing-2xs` | `spacing/2xs` | 4px | Sehr eng. Zusammengehörige Mini-Elemente, z. B. Icon und Zahl in einem Badge. |
| `--spacing-xs` | `spacing/xs` | 8px | Eng. Zusammengehörige Elemente, z. B. Label über einem Eingabefeld. |
| `--spacing-sm` | `spacing/sm` | 12px | Kompakt. Dichte Listen, kleine Karten, Zeilen in Tabellen. |
| `--spacing-md` | `spacing/md` | 16px | Standard. Normaler Abstand zwischen Elementen und üblicher Innenabstand. |
| `--spacing-lg` | `spacing/lg` | 24px | Großzügig. Abstand zwischen Gruppen innerhalb einer Karte oder eines Formulars. |
| `--spacing-xl` | `spacing/xl` | 32px | Deutlich. Abstand zwischen Karten oder eigenständigen Blöcken. |
| `--spacing-2xl` | `spacing/2xl` | 48px | Groß. Trennung größerer Inhaltsgruppen. |
| `--spacing-3xl` | `spacing/3xl` | 64px | Sehr groß. Abstand zwischen Bereichen einer Seite. |
| `--spacing-4xl` | `spacing/4xl` | 96px | Bühne. Luft um Hero-Bereiche und große Teaser. |
| `--spacing-5xl` | `spacing/5xl` | 128px | Maximal. Größte Trennung, z. B. zwischen Landingpage-Abschnitten. |

