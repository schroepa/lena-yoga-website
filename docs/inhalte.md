# Inhalte ändern

Alle Inhalte liegen als Dateien im Repository. Jede Änderung läuft über einen Pull Request. So prüft die CI
automatisch, dass nichts kaputtgeht, und du bekommst vor dem Veröffentlichen eine Vorschau.

## Kurse

Ein Kurs ist eine Datei in `apps/web/src/content/kurse/`. Der Dateiname ist frei (Kleinbuchstaben, Bindestriche),
zum Beispiel `sanft-ankommen.json`:

```json
{
  "titel": "Sanft ankommen",
  "ort": "online",
  "wochentag": "mo",
  "uhrzeit": "18:30",
  "dauerMinuten": 60,
  "beschreibung": "Ein ruhiger Einstieg mit viel Zeit für Pausen.",
  "buchungslink": "https://sophies-safe-space.example/buchen/sanft-ankommen"
}
```

| Feld           | Erlaubt                                  |
| -------------- | ---------------------------------------- |
| `ort`          | `online` oder `studio`                   |
| `wochentag`    | `mo`, `di`, `mi`, `do`, `fr`, `sa`, `so` |
| `uhrzeit`      | `HH:MM`, zum Beispiel `18:30`            |
| `dauerMinuten` | ganze Zahl größer null                   |
| `level`        | optional, Standard ist „Alle Level“      |
| `buchungslink` | Adresse, die mit `https://` beginnt      |

Einen Kurs entfernen: Datei löschen. Die Seite sortiert automatisch nach Wochentag und Uhrzeit.

## Ablauf

1. Branch anlegen, Datei ändern oder hinzufügen.
2. Lokal prüfen: `pnpm check` (Format, Lint, Typen, Tests, Build). Ein Fehler im Schema nennt die Datei und das Feld.
3. Pull Request öffnen. Die CI prüft zusätzlich Barrierefreiheit und Lighthouse. Vercel baut eine Vorschau.
4. Nach dem Merge nach `main` ist die Änderung nach ein bis zwei Minuten live.

## Neuen Inhaltstyp anlegen

1. Schema in `apps/web/src/lib/` anlegen (reines Zod, damit es sich testen lässt).
2. In `apps/web/src/content.config.ts` eine Collection mit `glob`-Loader eintragen.
3. Beispieldateien unter `apps/web/src/content/<name>/` anlegen und einen Test ergänzen, der alle Dateien gegen das Schema prüft
   (Vorbild: `apps/web/src/lib/kurse.test.ts`).
