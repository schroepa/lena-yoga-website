# Hosting: Schritt für Schritt

Ziel: Die öffentliche Seite läuft kostenlos bei **Cloudflare Pages**, das CMS (Payload) bei **Render**,
die Datenbank bei **Neon**, Bilder und Audio bei **Cloudflare R2**. Der Code bleibt auf GitHub.
Die Seite lädt die Inhalte beim Build aus dem CMS.

```
Lena veröffentlicht im CMS (Render)
        → Deploy Hook → Cloudflare Pages baut die Seite neu
Besucher → Cloudflare Pages (statische Dateien) und R2 (Bilder, Audio)
```

Das CMS wird nur zum Pflegen und zum Neubau gebraucht. Schläft der kostenlose Server bei Render,
merken Besucher nichts. Nur Lena wartet beim ersten Aufruf rund 30 Sekunden.

> Die Preise und Gratis-Grenzen ändern sich. Prüfe sie vor dem Livegang bei den Anbietern.
> Cloudflare Pages und R2 haben ein Gratis-Kontingent. Bei Render gibt es einen kostenlosen Tarif, der nach
> Inaktivität einschläft und wenig Arbeitsspeicher hat (siehe „Wenn der Gratis-Server nicht reicht“).

## Stand

| Baustein           | Zustand                                                     |
| ------------------ | ----------------------------------------------------------- |
| Datenbank (Neon)   | angelegt, Tabellen und erster Admin vorhanden               |
| Medien (R2)        | offen, Schritt 1                                            |
| CMS (Render)       | offen, Schritt 2                                            |
| Seite (Cloudflare) | offen, Schritt 3                                            |
| Neubau-Hook        | offen, Schritt 4                                            |
| Zwei-Faktor        | offen, vor dem Livegang (Abschnitt „Zwei-Faktor-Anmeldung“) |

## 1. Bilder und Audio (Cloudflare R2)

1. Cloudflare-Konto anlegen oder anmelden → **R2 Object Storage** → **Create bucket**.
   Name `lena-medien`, Region **Europe (EU)** wählen (Daten bleiben in der EU).
2. Im Bucket → **Settings** → **Public access**:
   - Für den Anfang **R2.dev subdomain** aktivieren. Die Adresse (`https://pub-….r2.dev`) ist deine `R2_PUBLIC_URL`.
     Sie ist für Tests gedacht und begrenzt.
   - Für den Livegang eine **Custom Domain** verbinden, zum Beispiel `medien.<deine-domain>`.
3. R2 → **Manage R2 API tokens** → **Create API token**: Berechtigung **Object Read & Write**,
   nur für den Bucket `lena-medien`. Du bekommst `Access Key ID`, `Secret Access Key` und eine
   Adresse der Form `https://<kontonummer>.r2.cloudflarestorage.com` (das ist `R2_ENDPOINT`).
   Der Secret Access Key wird nur einmal angezeigt. Speichere ihn im Passwortmanager.

## 2. CMS bei Render

1. Render-Konto anlegen (mit GitHub anmelden) → **New** → **Blueprint** → Repository `schroepa/lena-yoga-website`.
   Render liest `render.yaml` und legt den Dienst `lena-yoga-cms` in Frankfurt an.
2. Beim Anlegen fragt Render die geheimen Werte ab. Trage ein:

| Name                   | Wert                                                                          |
| ---------------------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL`         | die **direkte** Neon-URL (ohne `-pooler` im Hostnamen, mit `sslmode=require`) |
| `CMS_ORIGIN`           | Adresse des CMS, zum Beispiel `https://lena-yoga-cms.onrender.com`            |
| `WEB_ORIGIN`           | Adresse der Seite, zum Beispiel `https://lena-yoga.pages.dev`                 |
| `DEPLOY_HOOK_URL`      | folgt in Schritt 4, vorerst leer lassen                                       |
| `R2_BUCKET`            | `lena-medien`                                                                 |
| `R2_ENDPOINT`          | aus Schritt 1                                                                 |
| `R2_ACCESS_KEY_ID`     | aus Schritt 1                                                                 |
| `R2_SECRET_ACCESS_KEY` | aus Schritt 1                                                                 |
| `R2_PUBLIC_URL`        | aus Schritt 1, ohne Schrägstrich am Ende                                      |

`PAYLOAD_SECRET` erzeugt Render selbst. Das ist ein anderes Secret als das lokale aus deiner
`.env.production.local`. Das ist Absicht.

3. Render baut und startet. Beim Bauen laufen die Migrationen automatisch. Danach `…/admin` öffnen und
   mit dem Admin anmelden, der schon in Neon liegt.
4. Dienst → **Settings** → **Auto-Deploy** steht auf „After CI checks pass“. Render baut also erst, wenn
   die Prüfungen auf GitHub grün sind.

Der erste Admin existiert schon. Damit ist die Erstregistrierung über `/admin` geschlossen, bevor das CMS
öffentlich erreichbar ist.

## 3. Öffentliche Seite bei Cloudflare Pages

1. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → Repository wählen.
2. Einstellungen:
   - **Production branch:** `main`
   - **Root directory:** leer lassen (der Build braucht das ganze Monorepo)
   - **Build command:** `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @lena/web build`
   - **Build output directory:** `apps/web/dist`
3. Umgebungsvariablen (Production und Preview):

| Name              | Wert                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| `NODE_VERSION`    | `24.22.2`                                                                |
| `PUBLIC_SITE_URL` | endgültige Adresse der Seite, zum Beispiel `https://lena-yoga.pages.dev` |
| `CMS_URL`         | Adresse des CMS aus Schritt 2, ohne Schrägstrich am Ende                 |

4. **Save and Deploy.** Die Sicherheits-Header kommen aus `apps/web/public/_headers`, die Cache-Regeln auch.

## 4. Neubau nach dem Veröffentlichen

1. Cloudflare Pages-Projekt → **Settings** → **Builds** → **Deploy hooks** → **Add**, Name `cms-veroeffentlicht`,
   Branch `main`. URL kopieren.
2. Bei Render im CMS-Dienst die Variable `DEPLOY_HOOK_URL` mit dieser URL setzen. Die URL ist geheim.
3. Test: Im CMS einen Kurs veröffentlichen. Nach ein bis zwei Minuten steht er auf `/kurse`.

## 5. Nach dem Veröffentlichen prüfen

```bash
node scripts/pruefe-cms-live.mjs https://lena-yoga-cms.onrender.com
node scripts/pruefe-live.mjs https://lena-yoga.pages.dev
LH_URL=https://lena-yoga.pages.dev node scripts/lighthouse-check.mjs
```

Die erste Prüfung bestätigt unter anderem: Frame-Schutz, `noindex`, keine GraphQL-Schnittstelle,
Anlegen ohne Anmeldung verboten, nur Veröffentlichtes öffentlich, erste Registrierung geschlossen.
Die zweite prüft die Sicherheits-Header und das Caching der Seite. Die dritte misst Lighthouse live.

## Zwei-Faktor-Anmeldung

Payload bringt keine 2FA mit. Ohne sie schützt nur das Passwort das CMS. Das CMS hat Kontosperre
(fünf Fehlversuche, zehn Minuten), kurze Sitzungen und verlangt lange Passwörter beim ersten Admin.
Geplant ist `payload-totp` (Authenticator-App) als eigener Pull Request. Bis dahin das CMS nur zum
Ausprobieren benutzen und keine echten Daten von Lena eintragen.

## Wenn der Gratis-Server nicht reicht

Payload mit dem Admin-Bereich braucht Arbeitsspeicher. Der kostenlose Render-Tarif ist knapp bemessen.
Typische Zeichen: Der Build bricht mit „out of memory“ ab oder der Dienst startet immer wieder neu.
Dann in Render auf den kleinsten bezahlten Tarif wechseln (Größenordnung 7 $ pro Monat). Am Code ändert sich nichts.

## Betrieb

- **Backups:** Neon bietet Wiederherstellung auf einen früheren Zeitpunkt. Einmal ausprobieren (Branch aus einem früheren Zeitpunkt anlegen).
  R2 hat keine automatische Sicherung der Dateien. Einmal im Monat eine Kopie des Buckets ziehen, bis ein Plan steht.
- **Kosten:** Neon, R2 und Render haben Gratis-Grenzen. In den Dashboards Warnungen setzen.
- **Änderungen am Schema:** Neue Felder brauchen eine Migration (`pnpm --filter @lena/cms migrate:create <name>`),
  die im Pull Request mit eingecheckt wird. Der Build bei Render führt sie aus.
- **Datenschutz:** Mit Cloudflare, Render und Neon Auftragsverarbeitungsverträge abschließen und in der Datenschutzerklärung nennen.
- **Alte Vercel-Projekte:** Nach dem erfolgreichen Umzug löschen, damit nichts doppelt gebaut wird.
