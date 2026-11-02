# Umsetzung: Architektur, Sicherheit, Qualität

Stand: Entwurf zur Freigabe. Noch nichts gebaut.
Ziel: Schnelle Seite mit Astro, Inhalte in Payload CMS, Code auf GitHub, Auslieferung über Vercel.
Anspruch: Lighthouse 100 in allen vier Kategorien, Sicherheit und Codequalität auf aktuellem Stand.

## Entschieden (Antworten von Patrick)

- **Buchung:** Links zu Sophies Safe Space. Kein eigenes Buchungssystem.
- **Schrift:** Keine PP-Eiko-Lizenz vorhanden, darum **Fraunces** für Überschriften (frei, selbst gehostet) und DM Sans für Text.
- **Statistik:** Keine. Keine Skripte, keine Cookies, kein Banner.

## 1. Empfehlung in Kürze

| Thema     | Empfehlung                                                                                                                                     | Grund                                                                                                                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frontend  | Astro, **rein statisch** (`output: "static"`), Inhalte beim Build aus Payload gezogen                                                          | HTML ohne Laufzeit-JavaScript ist der sicherste Weg zu Lighthouse 100 und zu kurzen Ladezeiten. Kein Server, der ausfallen oder angegriffen werden kann.                                                                       |
| CMS       | Payload 3 als **eigenes Vercel-Projekt** (läuft auf Next.js), nur für Lena erreichbar                                                          | Payload 3 ist für den Betrieb in Next.js gebaut. Astro als getrenntes Frontend ist der übliche Weg bei „headless", aber weniger ausgetreten als Next.js + Payload. Das ist ein Risiko, das wir früh mit einem Prototyp prüfen. |
| Datenbank | PostgreSQL bei Neon (über Vercel Marketplace)                                                                                                  | Von Payload und Vercel offiziell unterstützt, Branches für Vorschau.                                                                                                                                                           |
| Medien    | Vercel Blob (Bilder, Audio)                                                                                                                    | Offizieller Adapter, CDN inklusive.                                                                                                                                                                                            |
| Repo      | Ein Monorepo auf GitHub (pnpm): `apps/web` (Astro), `apps/cms` (Payload), `packages/tokens` (Design-Tokens aus Figma)                          | Eine Versionierung, eine CI, Tokens an einer Stelle.                                                                                                                                                                           |
| Deploy    | Zwei Vercel-Projekte aus demselben Repo (Root-Verzeichnis je App). Nach Veröffentlichung in Payload löst ein Hook den Build des Frontends aus. | Inhalte erscheinen nach ein bis zwei Minuten, die Seite bleibt statisch.                                                                                                                                                       |
| Qualität  | Lighthouse CI als Pflicht-Check in jedem Pull Request                                                                                          | Schwellwert 100, kein Merge darunter.                                                                                                                                                                                          |

## 2. Was „Lighthouse 100 überall" bedeutet

Machbar auf einer statischen Seite, aber nicht automatisch und nicht zu garantieren:

- **Lab-Wert, kein Dauerzustand.** Lighthouse misst unter simulierter Drosselung. Ergebnisse schwanken. Darum prüft die CI mehrfach (mindestens drei, besser fünf Läufe) und wertet den Median aus. Das empfiehlt auch das Lighthouse-CI-Projekt ([treosh/lighthouse-ci-action](https://github.com/treosh/lighthouse-ci-action)).
- **Echte Nutzer sind etwas anderes.** Feldwerte (Core Web Vitals aus Chrome-Nutzerdaten) kann man nicht in CI prüfen. Wir messen sie nach dem Livegang.
- **Was Punkte kostet, schließen wir von vornherein aus:**
  - Skripte von Drittanbietern (Analytics, Chat, Social-Embeds, Tag Manager, Cookie-Banner-Dienste)
  - Webfonts von fremden Servern
  - Große, unkomprimierte Bilder; Bilder ohne Breite und Höhe
  - Seitenweites JavaScript-Framework im Browser
- **Was wir dafür einplanen:**
  - Bilder: Astro-Bildpipeline (AVIF und WebP, `srcset`, `width`/`height`, `loading="lazy"`, Hero-Bild mit `fetchpriority="high"` und passender Größe)
  - Schriften: nur WOFF2, selbst gehostet, nur benötigte Zeichen und Schnitte, `font-display: swap`, passende Ersatzschrift mit angeglichenen Metriken gegen Layoutsprünge
  - CSS: inline für die erste Ansicht, kein ungenutztes CSS
  - JavaScript: nur zwei kleine „Inseln" (Mobiles Menü, Audio-Player), sonst keines
  - Cache: lange Laufzeiten für Dateien mit Hash im Namen
  - SEO: Titel, Beschreibung, kanonische URL, Open Graph, `robots.txt`, Sitemap, strukturierte Daten
  - Barrierefreiheit: Kontraste (geprüft), Landmarken, Überschriftenebenen, Fokus, Skip-Link, `lang="de"`, Alt-Texte
  - Best Practices: HTTPS, keine Konsolenfehler, korrekte Seitenverhältnisse, sichere Header

## 3. Sicherheit

**Grundsatz:** Möglichst wenig laufende Technik am öffentlichen Rand. Die öffentliche Seite ist statisch. Angreifbar ist vor allem das CMS und das Kontaktformular.

### Öffentliche Seite

- Statische Auslieferung. Keine Datenbankverbindung vom Frontend aus.
- **Sicherheits-Header** über `vercel.json`: `Content-Security-Policy` (strikt, ohne `unsafe-inline`, mit Nonces oder Hashes), `Strict-Transport-Security` (mit Preload), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `frame-ancestors 'none'`.
- Keine Cookies. Damit entfällt der Cookie-Banner und es gibt keine Einwilligungsfrage.
- Statistik, falls gewünscht: cookiefrei und ohne Drittanbieter-Skript (zum Beispiel serverseitig oder eigener Zähler). Entscheidung offen (siehe Fragen).
- Kontaktformular („Lena schreiben"): kleiner Endpunkt (Vercel Function) mit Validierung, Honeypot, Ratenbegrenzung und ohne Speicherung personenbezogener Daten über das Nötige hinaus. Kein CAPTCHA-Dienst von außen. Versand per E-Mail-Dienst mit Auftragsverarbeitung (EU).

### CMS (Payload)

- Eigene Subdomain (zum Beispiel `cms.…`), nicht indexiert (`noindex`), Zugriff nur über Anmeldung.
- Starke Anmeldung: lange Passwörter, **Zwei-Faktor** für alle Konten (Payload unterstützt das über Auth-Erweiterungen, wir prüfen die aktuell empfohlene Lösung), Sperre nach Fehlversuchen, kurze Sitzungsdauer, Cookies `HttpOnly`, `Secure`, `SameSite`.
- Rollen: Redaktion (Lena) darf Inhalte bearbeiten. Nur Admin darf Benutzer und Einstellungen ändern. Zugriffsregeln pro Sammlung und Feld in Code definiert, **Standard ist „verboten"**.
- Öffentliche API nur lesend und nur für veröffentlichte Inhalte. Entwürfe nur mit geheimem Token.
- Uploads: erlaubte Dateitypen und Größen begrenzt, Bilder werden neu kodiert (entfernt Metadaten wie GPS), Audio auf MP3 begrenzt.
- Geheimnisse (`PAYLOAD_SECRET`, Datenbank, Blob-Token) nur als Vercel-Umgebungsvariablen. Niemals im Repo. Unterschiedliche Werte für Vorschau und Produktion.
- Backups der Datenbank (Neon Point-in-Time-Recovery) und regelmäßiger Wiederherstellungstest.

### GitHub und Lieferkette

- Branch-Schutz für `main`: Pull Request Pflicht, alle Checks grün, Review, signierte Commits, kein Force-Push.
- **Dependabot oder Renovate** für Abhängigkeiten, wöchentlich, mit Gruppierung. Lockfile eingecheckt, Installation nur mit `--frozen-lockfile`.
- **CodeQL**, **Secret Scanning** mit Push-Schutz, `pnpm audit` (oder OSV-Scanner) in der CI.
- GitHub-Actions-Berechtigungen auf das Minimum (`permissions: contents: read`), Actions auf Commit-Hash festgelegt.
- Vercel: Produktionsumgebung nur aus `main`, Schutz der Vorschau-Deployments, keine Secrets in Vorschau-Logs.
- Datenschutz und Recht: Impressum, Datenschutzerklärung, Auftragsverarbeitungsverträge mit Vercel, Neon und dem E-Mail-Dienst. Rechtstexte liefert eine fachkundige Stelle, nicht wir.

## 4. Codequalität

- **TypeScript strikt** (`strict`, `noUncheckedIndexedAccess`), Typen aus Payload erzeugen (`payload generate:types`) und im Frontend verwenden.
- **ESLint** (inkl. `jsx-a11y` und Astro-Plugin) und **Prettier**, `astro check` in CI.
- **Tests**
  - Komponenten und Hilfsfunktionen: Vitest
  - Ende-zu-Ende und Barrierefreiheit: Playwright mit axe-core
  - Visuelle Regression für die Komponenten (Playwright-Screenshots)
- **Lighthouse CI**: Schwellwert 1,0 für Leistung, Barrierefreiheit, Best Practices und SEO auf Start, Kurse, Yoga entdecken, Meditation (je mobil und Desktop), Median aus mehreren Läufen. Zusätzlich Größenbudgets (Gewicht pro Seite, JavaScript maximal wenige KB).
- **Git-Ablauf:** kleine Pull Requests, Conventional Commits, automatische Vorschau pro Pull Request, `husky` und `lint-staged` lokal.
- **Design-Tokens:** `tokens/*.css` aus dem Repo sind die Quelle. Keine festen Farb- oder Pixelwerte im Code. Ein Test prüft, dass nur Token-Variablen vorkommen.
- **Komponenten 1:1 zu Figma:** gleiche Namen wie in den Komponenten-Seiten (`Button`, `CourseRow`, …) und gleiche Props. Das hält die Übergabe nachvollziehbar.
- **Dokumentation:** `README` je App, Entscheidungsprotokoll (ADR) für jede größere Entscheidung.

## 5. Inhaltsmodell in Payload (erster Vorschlag)

| Sammlung                     | Felder (Auszug)                                                                                  | Verwendung                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| Kurse                        | Titel, Ort (online oder Studio), Wochentag, Uhrzeit, Dauer, Beschreibung, Buchungslink, sichtbar | Kurs-Zeile auf „Kurse"             |
| Meditationen                 | Titel, Dauer, Audio, Beschreibung, Reihenfolge                                                   | Audio-Player                       |
| Gedanken (Beiträge)          | Titel, Kategorie, Text (Rich Text), Titelbild, Lesezeit (automatisch), Datum                     | Beitrag-Teaser, Beitragsseiten     |
| Anleitungen                  | Titel, Haltungsart, Dauer, Schritte (Liste), Hinweis, Foto mit Alt-Text, Hilfsmittel             | Anleitungs-Karte, Anleitungsseiten |
| Häufige Fragen               | Frage, Antwort, Seite                                                                            | Frage-Eintrag                      |
| Medien                       | Datei, Alt-Text (Pflicht), Fokuspunkt                                                            | alle Bilder                        |
| Globals: Seiteneinstellungen | Name, Logo, Texte im Abschluss, Kontakt, Studio-Adresse                                          | Header, Footer, Abschluss          |
| Globals: Navigation          | Links, Reihenfolge                                                                               | Header, Mobiles Menü               |
| Globals: Rechtliches         | Impressum, Datenschutz                                                                           | Rechtliche Seiten                  |

Seiten wie Start, Lena und Yoga entdecken bestehen aus festen Abschnitten mit bearbeitbaren Texten und Bildern. **Alt-Text ist ein Pflichtfeld**, damit Lighthouse und Barrierefreiheit nicht von Vergesslichkeit abhängen.

## 6. Vorschlag für die Reihenfolge

1. **Fundament:** Monorepo, Tooling (TypeScript, ESLint, Prettier, Vitest), GitHub-Schutzregeln, CI-Gerüst, Vercel-Projekte, Sicherheits-Header. Erste leere Seite, die schon Lighthouse 100 erreicht.
2. **Tokens und Basis:** Tokens als Paket, Schriften (WOFF2, Subset), Layout, Header, Footer, Mobiles Menü.
3. **Payload-Prototyp:** Sammlungen, Rollen, Zugriff, Vorschau, Deploy-Hook. Test: Inhalt ändern, Seite aktualisiert sich.
4. **Seiten in der Reihenfolge Start, Kurse, Yoga entdecken, Meditation, Gedanken, Lena.** Pro Seite: Komponenten, Inhalte aus Payload, Tests, Lighthouse.
5. **Rechtliches und Abnahme:** Impressum, Datenschutz, Sicherheitsprüfung, Wiederherstellungstest, Last- und Fehlerfälle, Livegang.

Jeder Schritt ist ein eigener Pull Request mit grüner CI.

## 7. Risiken und offene Punkte

- **Astro mit Payload** ist ein weniger ausgetretener Weg als Next.js mit Payload. Darum früher Prototyp (Schritt 3). Wenn das zu viel Reibung erzeugt, ist die Alternative, die gesamte Seite in Next.js zu bauen (dann ohne Astro). Das wäre eine Entscheidung gegen deinen Wunsch und nur bei echten Problemen.
- **Die Schrift der Überschriften (PP Eiko)** ist eine kommerzielle Schrift. Für die Webnutzung braucht es eine passende **Lizenz**. Ohne Lizenz verwenden wir stattdessen die freie Schrift Fraunces. Rechtlich ist das Voraussetzung, kein Geschmack.
- **Fotos:** Die Bilder stammen aus Lenas Instagram. Für die Seite braucht es Originaldateien in hoher Auflösung (Exportwerte aus Instagram sind klein und komprimiert) sowie die Einwilligung der gezeigten Personen.
- **Buchung:** Technisch am einfachsten sind Links zu Sophies Safe Space. Ein eigenes Buchungssystem wäre ein eigenes Projekt (Zahlung, Datenschutz, Kalender).
- **Betrieb und Kosten:** Vercel Pro, Neon und Blob haben Kosten, die mit Zugriffen und Speicher steigen. Wir setzen Grenzen und Warnungen.
- **Lighthouse-Variabilität:** Ein einzelner Lauf unter 100 ist kein Fehler der Seite. Der Maßstab ist der Median mehrerer Läufe in CI.

## 8. Stand: Schritt 1 abgeschlossen (lokal)

- Monorepo mit pnpm, Node 24, strikter Lieferketten-Konfiguration (neue Versionen erst nach drei Tagen, keine Rückschritte bei Herkunftsnachweisen, Installationsskripte nur für drei Pakete).
- Astro (statisch) mit Basis-Layout, Logo, Schriften (Fraunces und DM Sans, selbst gehostet, zusammen rund 46 KB), Content-Security-Policy mit Hashes und Sicherheits-Header über `vercel.json`.
- Prüfungen laufen lokal grün: Format, ESLint (streng, mit Barrierefreiheitsregeln), TypeScript (strictest), Vitest, Playwright mit axe (mobil und Desktop), `pnpm audit`.
- Lighthouse 13.6 mobil und Desktop: **100 in allen fünf Kategorien**, auch in der neuen, noch experimentellen Kategorie „Agentic Browsing". Lade- und Renderzeiten unter 0,7 s im Labor.
- CI-Dateien für GitHub sind geschrieben (Qualität, Ende-zu-Ende, Lighthouse mit fünf Läufen, Lieferkette, CodeQL, Dependabot), aber noch nie auf GitHub gelaufen. Das Repository ist angelegt: https://github.com/schroepa/lena-yoga-website (öffentlich, `main` geschützt, alle fünf Prüfungen auf GitHub grün).
- Offen für Schritt 1: Vercel-Projekt verbinden (Import im Dashboard, Root `apps/web`), danach `node scripts/pruefe-live.mjs <Adresse>` und Lighthouse gegen die echte Adresse ausführen.
