# UX- und Accessibility-Audit: Start, Kurse, Yoga entdecken

Stand: erste Runde auf den Entwürfen in Figma (Design-Labor), mobil und Desktop.
Quellen: Nielsen Norman Group (NN/g) und WCAG 2.2. Kontrastwerte sind mit der WCAG-Formel
aus den echten Figma-Variablen berechnet, nicht geschätzt.

Schweregrad nach NN/g: 0 kein Problem · 1 kosmetisch · 2 gering · 3 gravierend · 4 katastrophal.

## Ergebnis in einem Satz

Die Seiten wirkten gedrängt, weil kleine, blasse Schrift, enge Abstände und viele verschachtelte Boxen
zusammenkamen. Der wichtigste Fehler war kein Gestaltungsgeschmack, sondern Kontrast: Fließtext und
Beschriftungen lagen bei 3,1 : 1 und verfehlten WCAG AA (4,5 : 1) auf nahezu jeder Fläche.

## Befunde

### 1. [Schweregrad 4] Fließtext zu hell

- **Wo:** alle Seiten, Token `text/muted` (Sage 500 `#699481`) für Einleitungen, Karten, Hinweise, Footer.
- **Problem:** 3,08 : 1 auf Seitenfläche, 2,87 : 1 auf `brand/subtle`. Fällt unter WCAG 1.4.3 (AA, 4,5 : 1).
  Hellgrauer Text mindert die Lesbarkeit besonders bei älteren Menschen und draußen auf dem Handy.
- **Beleg:** NN/g, Visual Design – Color and contrast; WCAG 1.4.3.
- **Behoben:** `text/muted` zeigt jetzt auf Sage 700 `#3d5f50`: 6,41 : 1 auf Seite, 5,99 : 1 auf `brand/subtle`,
  5,13 : 1 auf Butter. `text/primary` ist Ink 900 `#162e27` (13,0 : 1).

### 2. [Schweregrad 3] Buttontext auf Rosa und Sage zu schwach

- **Wo:** Buttons „Primär" und „Sekundär", Hauptbutton im Header.
- **Problem:** Text lag auf Ink 800: 3,6 : 1 auf Sage, 3,9 : 1 auf Watermelon. Button-Beschriftung ist kein „großer Text".
- **Behoben:** Text ist überall Ink 900: 5,03 : 1 auf Sage 450, 5,40 : 1 auf Watermelon 450.
- **Zusätzlich:** In den Kurse-Frames hatten 45 Button-Texte versehentlich die Cremefarbe (2,59 : 1). Neu an `text/primary` gebunden.

### 3. [Schweregrad 3] Bedienelemente schlecht erkennbar

- **Wo:** Filter „Online / Im Studio", Rahmen von Ghost-Buttons, Fokusring.
- **Problem:** `border/strong` 1,78 : 1 und Fokusring in Rosa nur 2,41 : 1. WCAG 1.4.11 verlangt 3 : 1 für Bedienelemente und 2.4.7/2.4.11 einen sichtbaren Fokus.
- **Beleg:** NN/g, Flat UI weakens clickability signifiers; WCAG 1.4.11.
- **Behoben:** `border/strong` ist Sage 550 (3,72 : 1), `focus/ring` ist Lilac 700 (6,10 : 1). Dekorative Kartenränder (`border/default`) bleiben bewusst zart, denn sie tragen keine Information.

### 4. [Schweregrad 3] Kleingedrucktes zu klein

- **Wo:** Eyebrow 12/13 px, Small 14 px, Meta-Zeilen, Footer-Links.
- **Problem:** Zu viele Informationen sitzen in der kleinsten Stufe. Auf dem Handy fehlt der Kontext, daher wird Lesen schwerer (NN/g, Reading Content on Mobile Devices).
- **Behoben:** Eyebrow 13 mobil / 14 Desktop, Small 15 / 16, Body Large 19 mobil. Zeilenhöhe Fließtext 160 %, Überschriften 118 bis 125 %.

### 5. [Schweregrad 3] Zu dicht

- **Wo:** alle Seiten.
- **Problem:** Abstand zwischen Sektionen 48 px mobil, Kartenpolster 24 px, Boxen in Boxen (Band → Karte → Tag). Nähe und gemeinsame Fläche gruppieren, zu viele Rahmen erzeugen Unruhe (NN/g, Gestalt: Proximity und Common Region).
- **Behoben:** Sektionsabstand mobil 64 px, Desktop 128 px. Bänder 32 px (mobil) und 80 px (Desktop) Innenabstand, Karten 24 px mobil und 40 px Desktop. Abstand zwischen Gruppen ist jetzt klar größer als innerhalb von Gruppen.

### 6. [Schweregrad 2] Zu lange Zeilen am Desktop

- **Problem:** Einleitungstexte liefen über 900 px und mehr als 100 Zeichen. Ideal sind etwa 50 bis 75.
- **Behoben:** Maximalbreite 680 px für Fließtext über 720 px Breite.

### 7. [Schweregrad 2] Zu viele Akzentfarben gleichzeitig

- **Wo:** Tags in Sage, Butter und Lilac nebeneinander; Bänder in vier Farben auf einer Seite.
- **Problem:** Jede zusätzliche Akzentfarbe schwächt die Hierarchie (NN/g, Visual Hierarchy). Farbe soll Bedeutung tragen.
- **Regel (neu):** Rosa nur für die eine Hauptaktion. Butter für Kurse und den Abschluss, Lilac nur für Meditation, Sage sonst. Tags innerhalb einer Karte immer einfarbig (Sage).

### 8. [Schweregrad 2] Gleichlautende Linktexte

- **Wo:** „Platz sichern" ×6, „Mehr lesen →" ×6.
- **Problem:** Beschriftungen ohne Informationsduft. Screenreader und Skimmer wissen nicht, wohin welcher Link führt (NN/g, Links und Informationsduft; WCAG 2.4.4).
- **Regel:** Sichtbar bleibt der kurze Text, der zugängliche Name (`aria-label`) enthält das Ziel: „Sanft ankommen buchen". Steht in der Komponenten-Dokumentation.

### 9. [Schweregrad 2] Navigation mobil versteckt

- **Wo:** Header mobil, nur Hamburger-Symbol ohne Beschriftung.
- **Problem:** Versteckte Navigation senkt Auffindbarkeit und Nutzung (NN/g, Hamburger Menus and Hidden Navigation).
- **Empfehlung:** Hauptaktion „Probestunde" sichtbar im Header halten, Menü-Symbol mit Text „Menü" und 44 × 44 px Trefferfläche. Bei der Umsetzung der Komponente „Header" berücksichtigt.

### 10. [Schweregrad 1] Trefferflächen

- **Problem:** Filter-Pillen 40 px, kleine Buttons 38 px hoch. NN/g empfiehlt etwa 1 cm (44 bis 48 px), WCAG 2.5.8 mindestens 24 px.
- **Behoben:** Filter 44 px. Kleine Buttons dürfen nur dort stehen, wo der Abstand zum nächsten Ziel mindestens 8 px beträgt.

## Was gut funktioniert (beibehalten)

- Eine klare Hauptaktion pro Ansicht („Probestunde buchen"), Sekundäres klar leiser (NN/g: ein Primärbutton pro Ansicht).
- Überschriften sind konkret und führen das Auge (Layer-Cake-Scannen): „Zwei Wege zu dir", „So fängst du an".
- Sprache ist objektiv und freundlich, ohne Werbesprache. Das stärkt Glaubwürdigkeit (NN/g, Concise, Scannable, Objective).
- Formen und Bogen sind Markenzeichen, nicht Deko. Farbe wird nie allein als Information genutzt (Tags tragen Text).

## Noch offen

1. Echte Fotos und Alt-Texte. Platzhalter haben keine Wirkung auf Kontrast und Vertrauen.
2. Hover-, Fokus-, Aktiv- und Deaktiviert-Zustände sind für die Komponenten dokumentiert, aber nicht an jeder Stelle gezeichnet.
3. Dunkle Flächen (Lena-Band): Cremetext auf Ink 900 hat 13 : 1, andere Töne dort noch nicht einzeln geprüft.
4. Test mit echten Menschen. Heuristische Prüfung findet Probleme, ersetzt keinen Test (NN/g: 5 Personen pro Runde reichen für die größten Hürden).
5. Barrierefreiheit im Code: Landmarks, Überschriftenebenen, Skip-Link, Reihenfolge der Tabulatortaste, `prefers-reduced-motion`.

## Wichtigste drei Prioritäten

1. Kontrast (Befunde 1 bis 3): erledigt, im Design und in den Tokens.
2. Dichte und Lesbarkeit (4 bis 6): erledigt, mit Prüfung per Bildschirmfoto.
3. Farb- und Linkregeln (7 und 8): als Regeln in den Komponenten-Seiten dokumentiert.
