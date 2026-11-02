# „KI-Look" erkennen und vermeiden

Ziel: Niemand soll der Seite ansehen, dass sie mit KI entstanden ist. Dieses Papier sammelt, woran man
KI-generierte Seiten erkennt, prüft unseren Entwurf ehrlich dagegen und schlägt Gegenmaßnahmen vor.

**Wie belastbar ist das?** Die Quellen sind Praxisberichte, Design-Blogs und Prüfwerkzeuge, keine
wissenschaftlichen Studien. Kein einzelnes Merkmal beweist etwas, erst das Zusammentreffen vieler wirkt
verdächtig. Auch das Gegenteil gilt: Eine Seite kann komplett von Menschen gemacht sein und trotzdem
„nach KI" aussehen, weil sie dieselben Muster nutzt. Eine Garantie, dass niemand etwas vermutet, kann
niemand geben. Der wirksamste Hebel ist echter, eigener Inhalt (Fotos, Stimme, Kursdaten).

Stand der Prüfung: Start, Kurse, Yoga entdecken im Figma-Entwurf (Design-Labor).

## 1. Die Merkmale

Legende: **Ja** = trifft auf unseren Entwurf zu · **Teils** = trifft in Teilen zu · **Nein** = trifft nicht zu.

### Aufbau und Layout

| Merkmal                                                                           | Unser Entwurf                                                                                                                   | Gegenmaßnahme                                                                                                                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drei oder vier gleich große Karten in einer Reihe (Raster aus identischen Karten) | **Ja**: Themenkarten (3 × 2), Ablauf in drei Schritten, Hilfsmittel, Weitere Anleitungen (4 Karten), „Haltung" mit drei Punkten | Mindestens ein Raster pro Seite aufbrechen: eine große Karte plus zwei kleine, Liste statt Karten, ein Thema bekommt ein Foto und mehr Platz. Anzahl nicht automatisch drei. |
| Alles steckt in Karten, Karten in Bändern, Rand und Rundung überall               | **Ja**: Kurs-Zeilen im Studio-Band, Hilfsmittel-Karten im gelben Band                                                           | Wo möglich ohne Rahmen arbeiten: Linien statt Boxen, Text direkt auf der Fläche. Karten nur für klickbare Einheiten.                                                         |
| Gleicher Rhythmus überall: Eyebrow, Titel, Einleitungssatz, Inhalt                | **Ja**, in nahezu jedem Abschnitt                                                                                               | Manche Abschnitte ohne Eyebrow und ohne Einleitung. Ein Abschnitt beginnt mit einem Foto, einer Zahl, einem Zitat oder einer Frage.                                          |
| Immer dieselben Abstände                                                          | **Teils**: seit der Entspannung einheitlich 64 / 128 px                                                                         | Abstände nach Inhalt variieren: eng bei zusammengehörigem, großzügig bei Themenwechsel. Zwei bis drei Rhythmen, nicht einer.                                                 |
| Generischer Hero: große Überschrift, Satz, zwei Buttons, Bild                     | **Teils**: Bogen und Sticker unterscheiden uns, die Struktur ist Standard                                                       | Hero mit echtem Foto von Lena in Aktion, kürzerer Satz, ein Button. Kein Sticker.                                                                                            |
| Alles zentriert und symmetrisch                                                   | **Nein**, wir sind meist linksbündig und asymmetrisch (Bogen)                                                                   | Beibehalten.                                                                                                                                                                 |
| Icon über jeder Überschrift                                                       | **Nein**                                                                                                                        | Beibehalten, keine Icon-Reihen einführen.                                                                                                                                    |
| Statistik-Block mit großen Zahlen („500+ Teilnehmende")                           | **Nein**                                                                                                                        | Nicht einführen. Erfundene Zahlen sind außerdem unehrlich.                                                                                                                   |

### Farbe und Oberfläche

| Merkmal                                                     | Unser Entwurf                                                                                          | Gegenmaßnahme                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Lila-/Violett-Verläufe, Indigo, Neon auf Schwarz            | **Nein**, aber **Teils**: Lilac-Band für Meditation liegt nah an „KI-Lila"                             | Lilac nur als kleiner Akzent oder durch ein warmes Blau-Grau ersetzen.                                                           |
| Verläufe auf Text und Buttons, Glas-Effekte, Leuchten       | **Nein**                                                                                               | Beibehalten.                                                                                                                     |
| Reines Schwarz und Weiß                                     | **Nein**, wir nutzen Creme und Ink                                                                     | Beibehalten.                                                                                                                     |
| Viele Akzentfarben gleichzeitig (Rosa, Butter, Lilac, Sage) | **Teils**                                                                                              | Pro Seite höchstens zwei Akzente. Regeln stehen im Audit.                                                                        |
| Weiche Schatten und gleiche Rundung überall                 | **Teils**: keine Schatten, aber fast alles 24 bis 48 px rund, plus Pillen für Buttons, Tags und Filter | Zwei Rundungen definieren (Pille nur für Aktionen, große Rundung nur für Bänder), alles andere schärfer oder gar nicht gerundet. |

### Typografie

| Merkmal                                                                                     | Unser Entwurf                                                         | Gegenmaßnahme                                                                                                                        |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Inter oder System-Schrift überall                                                           | **Nein**                                                              | Beibehalten.                                                                                                                         |
| Beliebte „Anti-KI"-Schriftpaare (Fraunces plus DM Sans sind unter KI-Tools sehr verbreitet) | **Teils**: Text- und Überschriftenschrift sind verbreitete Vorschläge | Die Überschrift ist jetzt PP Eiko (seltener, markant). Textschrift prüfen: eine weniger verbreitete Schrift mit Charakter einsetzen. |
| Standardskala der Schriftgrößen (12, 14, 16, 18, 24, 30, 36, 48, 60, 72)                    | **Nein**, eigene Stufen                                               | Beibehalten.                                                                                                                         |
| Überschrift mit Farbverlauf                                                                 | **Nein**                                                              | Beibehalten.                                                                                                                         |
| Monospace als „Tech-Look" auf normalem Text                                                 | **Nein** (nur in der Doku)                                            | Beibehalten.                                                                                                                         |

### Bilder

| Merkmal                                                                    | Unser Entwurf                       | Gegenmaßnahme                                                                                                         |
| -------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Weichgezeichnete, zu perfekte Menschen, seltsame Hände, schwebende Formen  | Noch **keine Bilder** (Platzhalter) | **Keine** KI-Bilder von Menschen. Nur echte Fotos von Lena, ihrem Studio und ihren Teilnehmenden, mit Einverständnis. |
| Generische Illustrationen, dünne Linien-Icons, die zu jedem Produkt passen | **Nein**                            | Beibehalten.                                                                                                          |
| Stock-Fotos mit Lächeln und Matte                                          | Noch nicht                          | Vermeiden. Gerade bei „alle Körper" zählt Echtheit. Stockfotos wirken sofort austauschbar.                            |
| Dekorative Mini-Diagramme, Zahlen-Kacheln                                  | **Nein**                            | Beibehalten.                                                                                                          |

Hinweis zur Studienlage: Die Nielsen Norman Group fand in einem kleinen Test keinen Vertrauensnachteil für
KI-Bilder, solange niemand wusste, dass sie von KI stammen
([NN/g, AI-Generated Images](https://nngroup.com/articles/ai-generated-images)). Zugleich berichten andere
Quellen, dass Vertrauen sinkt, sobald die KI-Herkunft offengelegt wird. Für diese Seite ist das trotzdem
die falsche Wette, denn ihre Haltung ist „alle Körper, echt und sicher". Das wird mit echten Menschen
glaubwürdig, nicht mit erzeugten.

### Bewegung und Interaktion

| Merkmal                                                  | Unser Entwurf        | Gegenmaßnahme                                                                              |
| -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| Federnde Animationen, Mitläufer-Cursor, Scroll-Hijacking | Noch nicht gestaltet | Nicht einbauen. Ruhige Übergänge unter 200 ms, mit Rücksicht auf `prefers-reduced-motion`. |
| Alle Bilder zoomen gleich beim Hover                     | Noch nicht gestaltet | Hover nur dort, wo es etwas auslöst.                                                       |
| Pop-ups und Dialoge für alles                            | Nein                 | Beibehalten.                                                                               |

### Text (Deutsch)

Die Muster sind in englischen Texten gemessen (z. B. Gedankenstriche etwa 10-fach, „Nicht nur X, sondern Y"
etwa 3-fach, Dreiergruppen etwa 4-fach häufiger als bei Menschen,
[Pangram](https://www.pangram.com/signs-of-ai-writing)). Im Deutschen gelten sinngemäß dieselben Muster.

| Merkmal                                                           | Beispiele aus unserem Entwurf                                                                                                                                                                                       | Gegenmaßnahme                                                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Verneinung gegen Aussage („nicht X, sondern Y", „keine X, nur Y") | „Hilfsmittel sind eine Einladung, keine Notlösung." · „Du musst nichts können, nur kommen." · „Es gibt keine falsche Form, nur deine." · „Yoga passt sich dir an, nicht umgekehrt." · „Ein Körper ist kein Projekt" | Höchstens einmal pro Seite. Aussagen direkt formulieren: „Jede Haltung gibt es mit Hilfsmitteln."                                  |
| Dreiergruppen und Aufzählungen aus drei Gliedern                  | „Langsam ankommen, spüren und bewegen" · „Ankommen. Zugewandt. Alle Körper." · „Block, Decke, Bolster"                                                                                                              | Zwei oder vier Glieder, oder einen konkreten Satz.                                                                                 |
| Glatte Wellness-Floskeln                                          | „Du darfst so ankommen, wie du bist." · „Du bist genug" · „Ein Raum, in dem du einfach sein darfst" · „Beides fühlt sich nach Ankommen an"                                                                          | Konkret werden: Wie sieht die Stunde aus? Was passiert in den ersten zehn Minuten? Was sagt Lena, wenn jemand sich unsicher fühlt? |
| Schlagzeilen ohne Gewicht                                         | „Finde deinen Platz auf der Matte." · „Eine Pause für dich"                                                                                                                                                         | Aussagen, die nur für Lena stimmen: Ort, Gruppengröße, ihr Satz, eine Zahl, die stimmt.                                            |
| Gleicher Satzbau, gleiche Länge                                   | Viele kurze Sätze hintereinander im gleichen Takt                                                                                                                                                                   | Längen mischen. Gelegentlich ein Nebensatz, ein Gedankenstrich im Sinn, eine Frage.                                                |
| Sonderzeichen als Schmuck                                         | „Mehr lesen →", „Mo · 18:30"                                                                                                                                                                                        | Pfeile weglassen oder per CSS setzen, Punkte als Trenner sparsam.                                                                  |
| Erfundener Inhalt                                                 | Kursnamen, Zeiten, Beschreibungen sind Platzhalter                                                                                                                                                                  | **Alle durch echte Angaben ersetzen**, bevor die Seite online geht.                                                                |

## 2. Maßnahmen, nach Wirkung sortiert

1. **Echte Fotos von Lena** in Hero, Über-mich, Kursen, Meditation. Ohne dieses Material wirkt jede Seite austauschbar. Dazu gehört auch ein kurzes Gespräch oder eine Sprachnachricht von Lena, aus der Zitate entstehen.
2. **Texte aus Lenas Mund.** Ihre Instagram-Beiträge, Sprachnachrichten und E-Mails sind die Quelle. Ich kann strukturieren und kürzen, die Wörter und Gedanken sollen von ihr kommen. Alles, was nach Plakat klingt, raus.
3. **Echte Daten:** Kurse, Zeiten, Preise, Ort, Anfahrt, Impressum. Platzhalter sind der sichtbarste Beweis für Vorlagen.
4. **Raster aufbrechen:** pro Seite genau eine Stelle, an der die Karten ungleich sind. Eine Themen-Karte größer, zwei kleiner, eine als reine Textzeile.
5. **Karten zurückbauen:** weniger Rahmen, weniger Boxen in Boxen, Bänder nur dreimal pro Seite.
6. **Eine Handschrift einführen**, die nur zu Lena passt: zum Beispiel handgezeichnete Linie unter Überschriften, ihre Handschrift für Unterschrift, eine feste Bildsprache (immer Tageslicht, immer echte Räume).
7. **Rundungen und Pillen reduzieren**, Lila entschärfen, Textschrift prüfen.
8. **Texte durchgehen** (Abschnitt „Text") mit einer Streichliste: Verneinungs-Sätze, Dreiergruppen, Floskeln.
9. **Unvollkommenheit zulassen:** unterschiedliche Bildformate, ein Abschnitt ohne Überschrift, ein handgeschriebenes Zitat.
10. **Technik:** korrekte Meta-Daten, eigene Favicon, 404-Seite in Lenas Ton, keine Standard-Texte aus Vorlagen („Lorem", „Get started"). Prüfen mit einem Fremden: Fünf Personen (NN/g-Regel) schauen zehn Sekunden auf die Seite und sagen, wie sie wirkt.

## 3. Prüfliste vor dem Livegang

- [ ] Kein Platzhaltertext, kein Platzhalterbild.
- [ ] Jedes Foto ist echt und freigegeben. Alt-Texte beschreiben, was zu sehen ist.
- [ ] Höchstens eine „nicht X, sondern Y"-Konstruktion pro Seite.
- [ ] Kein Satz, der auf jeder Yoga-Seite stehen könnte.
- [ ] Mindestens ein Abschnitt pro Seite weicht vom Raster ab.
- [ ] Höchstens zwei Akzentfarben pro Seite.
- [ ] Zwei verschiedene Abstandsrhythmen pro Seite.
- [ ] Texte laut gelesen. Klingt es nach Lena?
- [ ] Fünf Menschen außerhalb des Projekts haben die Seite gesehen.

## Quellen

- [How to detect AI slop in your design (Laith0003, GitHub Wiki)](https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design)
- [AI Slop Fonts and Gradients: The Tells That Give Away AI Design (925 Studios)](https://www.925studios.co/blog/ai-slop-design-tells)
- [AI Slop Pattern Catalog (pixelslop)](https://cdn.jsdelivr.net/npm/pixelslop@0.3.8/dist/skill/resources/ai-slop-patterns.md)
- [Why Your AI Keeps Building the Same Purple Gradient Website (prg.sh)](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)
- [AI design slop: overused UI patterns (noqta)](https://noqta.tn/en/blog/ai-design-slop-overused-ui-patterns-fix-2026)
- [9 Signs of AI Writing, Backed by Data (Pangram)](https://www.pangram.com/signs-of-ai-writing)
- [AI-Generated Images (Nielsen Norman Group)](https://nngroup.com/articles/ai-generated-images)
- [How the use of AI-generated images can jeopardize brand trust (The Drum)](https://www.thedrum.com/industry-insight/how-the-use-of-ai-generated-images-can-jeopardize-brand-trust)
