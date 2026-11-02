# CMS veröffentlichen: Schritt für Schritt

Ziel: Payload läuft als eigenes Vercel-Projekt (`lena-yoga-cms`) mit Neon (Datenbank) und Vercel Blob (Bilder, Audio).
Die öffentliche Seite (`web`) lädt die Inhalte beim Build aus diesem CMS.

> Reihenfolge ist wichtig: **Erst Datenbank und ersten Admin anlegen, dann das CMS veröffentlichen.**
> Solange es keinen Benutzer gibt, kann jeder, der die Adresse kennt, über `/admin` den ersten Admin anlegen.

## Vorher entscheiden

| Thema                 | Empfehlung                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Tarif                 | Für die echte Seite Vercel **Pro** (Hobby ist für kommerzielle Nutzung nicht vorgesehen). Zum Ausprobieren reicht Hobby. |
| Region                | Frankfurt (`fra1` bei Vercel, `eu-central-1` bei Neon). Daten bleiben in der EU.                                         |
| Zwei-Faktor-Anmeldung | Vor dem Livegang klären, siehe Abschnitt 7.                                                                              |
| Domain                | Später: `cms.<deine-domain>`. Bis dahin die Vercel-Adresse.                                                              |

## 1. Datenbank anlegen (Neon über Vercel)

1. Vercel → Team „schroepa's projects" → **Storage** → **Create Database** → **Neon (Postgres)**.
2. Region **Europe (Frankfurt)**, Name `lena-cms`. Tarif „Free" reicht für den Anfang.
3. Noch **nicht** mit einem Projekt verbinden. Öffne die Datenbank und kopiere die **nicht gepoolte** Verbindungs-URL
   (`DATABASE_URL_UNPOOLED`, beginnt mit `postgres://` und enthält `sslmode=require`).

## 2. Tabellen und ersten Admin anlegen (auf deinem Rechner)

Die Verbindungs-URL ist ein Geheimnis. Gib sie nur in deinem Terminal ein, nicht in Chats oder Dateien.

```bash
export DATABASE_URL='postgres://…'            # die URL aus Schritt 1
export PAYLOAD_SECRET="$(openssl rand -hex 32)"  # nur für diese Befehle nötig
NODE_ENV=production pnpm --filter @lena/cms migrate
ADMIN_EMAIL='lena@example.com' ADMIN_PASSWORD='eine lange Passphrase' pnpm --filter @lena/cms admin:anlegen
```

Das Passwort braucht mindestens 16 Zeichen. Danach `unset DATABASE_URL PAYLOAD_SECRET ADMIN_PASSWORD`.

## 3. Blob-Speicher anlegen

Vercel → **Storage** → **Create** → **Blob**. Name `lena-media`, Region Frankfurt, Zugriff **Public**
(Bilder und Audio sind ohnehin öffentlich sichtbar).

## 4. CMS-Projekt anlegen

1. Vercel → **Add New → Project** → Repository `schroepa/lena-yoga-website`.
2. **Project Name:** `lena-yoga-cms`. **Root Directory:** `apps/cms`. Framework: Next.js (wird erkannt).
   Install- und Build-Befehl kommen aus `apps/cms/vercel.json`.
3. Noch nicht auf „Deploy" klicken, zuerst die Umgebungsvariablen (Schritt 5) setzen.
4. **Storage** im Projekt: Neon-Datenbank `lena-cms` und Blob `lena-media` **verbinden**. Vercel setzt dabei
   `DATABASE_URL`, `DATABASE_URL_UNPOOLED` und `BLOB_READ_WRITE_TOKEN` automatisch.

## 5. Umgebungsvariablen im CMS-Projekt

| Name                     | Wert                                                                               | Typ       |
| ------------------------ | ---------------------------------------------------------------------------------- | --------- |
| `PAYLOAD_SECRET`         | Neu erzeugt mit `openssl rand -hex 32` (nicht den aus Schritt 2 wiederverwenden)   | Sensitive |
| `DATABASE_URL`           | gesetzt durch die Neon-Verbindung (gepoolt)                                        | Sensitive |
| `DATABASE_URL_UNPOOLED`  | gesetzt durch die Neon-Verbindung (für Migrationen im Build)                       | Sensitive |
| `BLOB_READ_WRITE_TOKEN`  | gesetzt durch die Blob-Verbindung                                                  | Sensitive |
| `CMS_ORIGIN`             | Adresse des CMS, zum Beispiel `https://lena-yoga-cms.vercel.app`                   | Plain     |
| `WEB_ORIGIN`             | Adresse der öffentlichen Seite, zum Beispiel `https://web-seven-bay-95.vercel.app` | Plain     |
| `VERCEL_DEPLOY_HOOK_URL` | folgt in Schritt 6                                                                 | Sensitive |

Alle für **Production** (die Werte der Vorschau sollten nie auf die Produktionsdatenbank zeigen).
Deployment Protection: **Vercel Authentication** für Previews eingeschaltet lassen.

Jetzt **Deploy**. Danach `Visit`, dich mit dem Admin aus Schritt 2 anmelden.

## 6. Neubau der Seite verbinden

1. Projekt **web** → **Settings → Git → Deploy Hooks** → Name `cms-veroeffentlicht`, Branch `main` → **Create**. URL kopieren.
2. Im CMS-Projekt `VERCEL_DEPLOY_HOOK_URL` mit dieser URL setzen (Sensitive), CMS neu deployen.
3. Im Projekt **web** die Variable `CMS_URL` setzen: Adresse des CMS (ohne Schrägstrich am Ende), **Production** und Preview. Danach web neu deployen.

Test: Im CMS einen Kurs veröffentlichen. Nach ein bis zwei Minuten steht er auf `/kurse`.

## 7. Zwei-Faktor-Anmeldung

Payload bringt keine 2FA mit. Ohne sie schützt nur das Passwort das CMS. Das CMS hat Kontosperre
(fünf Fehlversuche, zehn Minuten), kurze Sitzungen und verlangt lange Passwörter beim ersten Admin. Das ist ein
brauchbarer Anfang, aber vor dem Livegang sollte 2FA dazukommen. Optionen:

- **`payload-totp`** (Authenticator-App, für Payload 3). Kleines Projekt, wir würden den Quelltext vorher prüfen
  und die Version festlegen.
- **Zugangsschutz vor dem CMS** (zum Beispiel Cloudflare Access), braucht eine eigene Domain bei Cloudflare.

## 8. Nach dem Veröffentlichen prüfen

```bash
node scripts/pruefe-cms-live.mjs https://lena-yoga-cms.vercel.app
node scripts/pruefe-live.mjs https://web-seven-bay-95.vercel.app
```

Die erste Prüfung bestätigt unter anderem: Frame-Schutz, `noindex`, keine GraphQL-Schnittstelle,
Anlegen ohne Anmeldung verboten, nur Veröffentlichtes öffentlich, erste Registrierung geschlossen.

## 9. Betrieb

- **Backups:** Neon bietet Wiederherstellung auf einen früheren Zeitpunkt. Einmal ausprobieren (Branch aus einem früheren Zeitpunkt anlegen).
- **Kosten:** Neon und Blob haben Freikontingente, danach nach Verbrauch. Im Dashboard Grenzen und Warnungen setzen.
- **Änderungen am Schema:** Neue Felder brauchen eine Migration (`pnpm --filter @lena/cms migrate:create <name>`), die im Pull Request mit eingecheckt wird. Der Vercel-Build führt sie aus.
