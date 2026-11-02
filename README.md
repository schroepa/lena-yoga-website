# Lena Yoga: Website

Website für Lena (Yoga für alle Körper, online über Sophies Safe Space und im Studio).
Frontend mit [Astro](https://astro.build) (rein statisch), Inhalte in Payload CMS, Auslieferung über Vercel.

| Ordner            | Inhalt                                            |
| ----------------- | ------------------------------------------------- |
| `apps/web`        | Astro-Frontend                                    |
| `apps/cms`        | Payload CMS (folgt in Schritt 3)                  |
| `packages/tokens` | Design-Tokens aus Figma als CSS Custom Properties |
| `docs`            | Architektur, UX-Audit, Prüfung auf „KI-Look"      |
| `scripts`         | Lighthouse-Prüfung, GitHub-Einrichtung            |

Hintergründe stehen in [docs/architektur.md](docs/architektur.md).

## Entwickeln

Voraussetzung: Node 24 (`nvm use`) und pnpm (`corepack enable`).

```bash
pnpm install
pnpm dev            # lokaler Server
pnpm check          # Format, Lint, Typen, Tests, Build
pnpm test:e2e       # Playwright und axe (Barrierefreiheit)
pnpm lighthouse     # Lighthouse mobil und Desktop, Median, Ziel 100 in allen Kategorien
```

## Qualitätsregeln

- Alle vier klassischen Lighthouse-Kategorien (Leistung, Barrierefreiheit, Best Practices, SEO) und die neue Kategorie „Agentic Browsing" müssen 100 erreichen. Die CI misst fünf Läufe und wertet den Median.
- Keine Drittanbieter-Skripte, keine Cookies, keine externen Schriften oder Bilder.
- Keine festen Farben oder Pixelwerte im Code, nur Token-Variablen.
- Jede Änderung läuft über einen Pull Request mit grüner CI.
- Commit-Nachrichten im Format [Conventional Commits](https://www.conventionalcommits.org) (wird per Hook geprüft).

## Sicherheit

Siehe [SECURITY.md](SECURITY.md). Sicherheits-Header stehen in `apps/web/vercel.json`.
