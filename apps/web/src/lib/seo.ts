/** Kürzt einen Text für die Seitenbeschreibung, ohne mitten im Wort abzuschneiden. */
export function kuerzeBeschreibung(text: string, maximal = 160): string {
  const sauber = text.replace(/\s+/g, ' ').trim();
  if (sauber.length <= maximal) return sauber;
  const abschnitt = sauber.slice(0, maximal - 1);
  const letzteLuecke = abschnitt.lastIndexOf(' ');
  return `${(letzteLuecke > 0 ? abschnitt.slice(0, letzteLuecke) : abschnitt).trimEnd()}…`;
}
