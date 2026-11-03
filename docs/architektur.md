# Architektur, Sicherheit, Qualität

Ziel: Eine schnelle, sichere, statische Seite mit Astro. Inhalte liegen als Dateien im Repository,
der Code liegt auf GitHub, Vercel veröffentlicht. Anspruch: Lighthouse 100 in allen Kategorien,
Sicherheit und Codequalität auf aktuellem Stand.

## Entschieden

- **Kein CMS.** Ein CMS bräuchte einen eigenen Server, eine Datenbank, Anmeldung mit Zwei-Faktor und laufende Pflege.
  Das wäre für eine Seite, die sich selten ändert, zu aufwendig und eine zusätzliche Angriffsfläche.
  Es gab einen Payload-Prototyp (Pull Requests 5 und 6). Er ist entfernt, der Stand steht in der Git-Historie.
- **Inhalte als Dateien.** Patrick ändert sie für Lena per Pull Request (siehe [inhalte.md](inhalte.md)).
- **Buchung:** Links zu Sophies Safe Space. Kein eigenes Buchungssystem.
- **Schrift:** Fraunces für Überschriften, DM Sans für Text, beide selbst gehostet.
- **Statistik:** Keine. Keine Skripte von Dritten, keine Cookies, kein Banner.

## 1. Aufbau

| Thema    | Umsetzung                                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| Frontend | Astro, **rein statisch** (`output: "static"`), kein JavaScript außer dem mobilen Menü                                |
| Inhalte  | Astro Content Collections: eine Datei pro Eintrag in `apps/web/src/content/…`, beim Build gegen ein Schema geprüft   |
| Repo     | Monorepo (pnpm): `apps/web` (Astro), `packages/tokens` (Design-Tokens aus Figma)                                     |
| Hosting  | Vercel, Projekt `web` aus diesem Repo. Jeder Merge nach `main` veröffentlicht. Pull Requests bekommen eine Vorschau. |
| Qualität | Lighthouse in der CI als Pflicht-Check, Schwellwert 100 (Median aus fünf Läufen)                                     |

**Fehlerhafte Inhalte erreichen nie die Besucher.** Passt eine Datei nicht zum Schema (zum Beispiel eine falsche Uhrzeit
oder ein Link ohne `https`), bricht der Build ab, die CI wird rot und die alte Seite bleibt online.

## 2. Was „Lighthouse 100 überall“ bedeutet

Machbar auf einer statischen Seite, aber nicht automatisch und nicht zu garantieren:

- **Lab-Wert, kein Dauerzustand.** Lighthouse misst unter simulierter Drosselung, Ergebnisse schwanken. Darum prüft die CI
  fünfmal und wertet den Median aus. Echte Nutzerwerte (Core Web Vitals) lassen sich nur nach dem Livegang messen.
- **Ausgeschlossen von Anfang an:** Skripte von Drittanbietern, Webfonts von fremden Servern, große Bilder ohne Maße,
  ein seitenweites JavaScript-Framework im Browser.
- **Eingeplant:**
  - Bilder: Astro-Bildpipeline (AVIF und WebP, `srcset`, `width`/`height`, `loading="lazy"`, Hero-Bild mit `fetchpriority="high"`)
  - Schriften: nur WOFF2, selbst gehostet, nur benötigte Schnitte, passende Ersatzschrift gegen Layoutsprünge
  - CSS inline, kein ungenutztes CSS. Lange Cache-Zeiten für Dateien mit Hash im Namen
  - SEO: Titel, Beschreibung, kanonische URL, `robots.txt`, Sitemap, strukturierte Daten
  - Barrierefreiheit: Kontraste, Landmarken, Überschriftenebenen, Fokus, `lang="de"`, Alt-Texte (Pflichtfeld im Schema)
  - Best Practices: HTTPS, keine Konsolenfehler, sichere Header

## 3. Sicherheit

**Grundsatz:** Möglichst wenig laufende Technik. Die Seite ist statisch. Es gibt keinen Server, keine Datenbank, keine Anmeldung
und keine Geheimnisse im Betrieb. Das ist die kleinste mögliche Angriffsfläche.

- **Header** über `apps/web/vercel.json`: strenge `Content-Security-Policy` (die Hashes stecken als meta-Tag in jeder Seite,
  die Header ergänzen `frame-ancestors` und weitere), `Strict-Transport-Security` mit Preload, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `COOP`, `CORP`.
- Keine Cookies, keine Drittanbieter, keine Statistik. Damit entfällt der Cookie-Banner.
- Kontaktformular (falls später gewünscht): kleiner Endpunkt mit Validierung, Honeypot und Ratenbegrenzung, kein externer CAPTCHA-Dienst.
- **GitHub und Lieferkette:**
  - Branch-Schutz für `main`: Pull Request Pflicht, alle Prüfungen grün, kein Force-Push
  - Neue Paketversionen erst nach drei Tagen (`minimumReleaseAge`), keine Rückschritte bei Herkunftsnachweisen (`trustPolicy`)
  - Installationsskripte nur für `esbuild` und `sharp`, Installation nur mit Lockfile
  - Dependabot, CodeQL, Secret Scanning, `pnpm audit` in der CI, Actions auf Commit-Hash festgelegt, minimale Berechtigungen
- Datenschutz und Recht: Impressum und Datenschutzerklärung liefert eine fachkundige Stelle. Mit Vercel einen
  Auftragsverarbeitungsvertrag abschließen und nennen.

## 4. Codequalität

- **TypeScript strikt**, **ESLint** (mit `jsx-a11y` und Astro-Plugin), **Prettier**, `astro check` in der CI.
- **Tests:** Vitest für Hilfsfunktionen und alle Inhaltsdateien, Playwright mit axe-core (WCAG 2.2 AA) für Seiten und Menü.
- **Git-Ablauf:** kleine Pull Requests, Conventional Commits, `husky` und `lint-staged` lokal.
- **Design-Tokens:** `packages/tokens` ist die Quelle. Keine festen Farb- oder Pixelwerte im Code.
- **Komponenten 1:1 zu Figma:** gleiche Namen und Props wie in den Komponenten-Seiten.

## 5. Inhaltsmodell

Jeder Inhaltstyp ist eine Collection mit Schema in `apps/web/src/content.config.ts`. Alt-Texte sind Pflicht.

| Collection   | Ordner                     | Stand     | Verwendung                   |
| ------------ | -------------------------- | --------- | ---------------------------- |
| `kurse`      | `src/content/kurse`        | vorhanden | Kurs-Zeile auf „Kurse“       |
| Meditationen | `src/content/meditationen` | folgt     | Audio-Player                 |
| Gedanken     | `src/content/gedanken`     | folgt     | Beiträge (Markdown)          |
| Anleitungen  | `src/content/anleitungen`  | folgt     | Anleitungs-Karte und -Seiten |
| Fragen       | `src/content/fragen`       | folgt     | Häufige Fragen               |

Navigation und feste Seitentexte (Start, Lena, Yoga entdecken) stehen im Code und ändern sich per Pull Request.
Bilder und Audio liegen im Repository (`src/assets`), Bilder laufen durch die Astro-Bildpipeline. Große Audiodateien
brauchen später eine eigene Lösung (Git LFS oder Vercel Blob), das entscheiden wir, wenn die Meditationen gebaut werden.

## 6. Reihenfolge

1. **Fundament** (erledigt): Monorepo, Tooling, GitHub-Regeln, CI, Header, erste Seite mit Lighthouse 100.
2. **Tokens und Basis** (erledigt): Tokens, Schriften, Layout, Header, Footer, mobiles Menü.
3. **Inhalte als Dateien** (dieser Stand): Content Collections, Schema-Prüfung, Prototyp `/kurse`.
4. **Seiten:** Start, Kurse, Yoga entdecken, Meditation, Gedanken, Lena. Pro Seite: Komponenten, Inhalte, Tests, Lighthouse.
5. **Rechtliches und Abnahme:** Impressum, Datenschutz, Sicherheitsprüfung, Livegang.

Jeder Schritt ist ein eigener Pull Request mit grüner CI.

## 7. Risiken und offene Punkte

- **Vercel-Tarif:** Der kostenlose Hobby-Tarif ist laut Nutzungsbedingungen nicht für gewerbliche Seiten gedacht. Vor dem Livegang
  entweder Pro (rund 20 $ pro Monat) oder ein anderer Hoster für statische Seiten. Am Code ändert sich dabei nichts,
  nur die Header-Datei (`vercel.json`) müsste für den neuen Hoster übersetzt werden.
- **Änderungen hängen an Patrick.** Das ist gewollt. Wenn Lena später selbst pflegen will, lässt sich ein dateibasierter
  Editor (zum Beispiel Keystatic) nachrüsten, ohne die Dateien zu ändern.
- **Fotos:** Es braucht Originaldateien in hoher Auflösung und die Einwilligung der gezeigten Personen.
- **Lighthouse-Variabilität:** Ein einzelner Lauf unter 100 ist kein Fehler der Seite. Maßstab ist der Median mehrerer Läufe.
- **Abhängigkeiten:** Offen bleibt eine geringe Meldung zu `minimatch` in den Entwicklungswerkzeugen (ESLint). Sie betrifft
  nicht die ausgelieferte Seite.

## 8. Stand

- Schritte 1 und 2 sind erledigt, die Seite läuft bei Vercel.
- Schritt 3: Der Payload-Prototyp ist zurückgebaut. `/kurse` liest vier Beispielkurse aus `src/content/kurse`.
  Die Texte und Links sind Platzhalter und werden vor dem Livegang durch Lenas echte Kurse ersetzt.
- Offen: `PUBLIC_SITE_URL` in Vercel setzen (kanonische Links und Sitemap zeigen sonst auf `lena-yoga.example`),
  Domain, Tarif, die Seiten aus Schritt 4.
