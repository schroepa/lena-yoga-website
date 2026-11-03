# Sicherheit

## Schwachstellen melden

Bitte keine öffentlichen Issues für Sicherheitsprobleme. Nutze stattdessen die private Meldung über
GitHub („Security“ → „Report a vulnerability“) oder schreibe an den Betreiber der Seite.

Wir bestätigen den Eingang innerhalb von drei Werktagen und melden uns mit einem Plan zur Behebung.

## Grundsätze

- Die öffentliche Seite ist statisch. Es gibt keine Datenbankverbindung vom Frontend aus.
- Keine Cookies, keine Drittanbieter-Skripte, keine Statistik.
- Es gibt keine Geheimnisse im Betrieb. Die einzige Einstellung ist die Adresse der Seite (`PUBLIC_SITE_URL`) in Vercel.
- Abhängigkeiten werden über ein Lockfile aufgelöst, neue Versionen erst nach drei Tagen.
- Jede Änderung läuft über einen Pull Request mit grüner Prüfung (Lint, Typen, Tests, Barrierefreiheit,
  Lighthouse, CodeQL).
